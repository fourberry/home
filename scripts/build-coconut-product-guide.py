"""공개 데이터와 검토된 화면으로 제품설명서를 생성합니다. ReportLab/Pillow, Node 22.13+ 필요."""

import argparse
import io
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


def load_content(root):
    # 현재 홈페이지의 단일 출처를 읽습니다. 임의 서버 요청이나 비공개 데이터 조회는 하지 않습니다.
    code = r"""
import fs from 'node:fs'
import vm from 'node:vm'
import {stripTypeScriptTypes} from 'node:module'
const take=(file,expression)=>vm.runInNewContext(stripTypeScriptTypes(fs.readFileSync(file,'utf8')).replace(/\bexport /g,'')+'\n;('+expression+')',{})
const coconut=take('data/coconut.ts','({guide:coconutProductGuide,hero:coconutHero,facts:coconutFacts,ai:coconutAi,flows:coconutAuthFlows,login:coconutLoginSteps,tour:coconutTour,security:coconutSecurity,compatibility:coconutCompatibility,operations:coconutOperations,spec:coconutSpec,adoption:coconutAdoption,supply:coconutSupply})')
const solution=take('data/solutions.ts',"fbSolutions.find(s=>s.slug==='coconut')")
const company=take('data/company.ts','({info:fbCompany,url:SITE_URL})')
process.stdout.write(JSON.stringify({coconut,solution,company}))
"""
    result = subprocess.run(['node', '--input-type=module', '-e', code], cwd=root, capture_output=True, check=True)
    return json.loads(result.stdout.decode('utf-8'))


class Guide:
    def __init__(self, root, destination, web):
        self.root = root
        self.data = load_content(root)
        self.coco = self.data['coconut']
        self.solution = self.data['solution']
        self.company = self.data['company']
        self.meta = self.coco['guide']
        self.width, self.height = landscape(A4)
        self.margin = 42
        self.body_width = self.width - 2 * self.margin
        self.accent = colors.HexColor(self.solution['brand']['accent'])
        self.ink = colors.HexColor('#302a25')
        self.muted = colors.HexColor('#625c55')
        self.surface = colors.HexColor('#f5f1ed')
        self.line = colors.HexColor('#dfd7cf')
        self.web = web
        self.images = {}
        self.page = 0
        for name, file in [('Guide', 'Happiness-Sans-Regular.ttf'), ('GuideBold', 'Happiness-Sans-Bold.ttf')]:
            pdfmetrics.registerFont(TTFont(name, str(root / 'assets/fonts' / file)))
        destination.parent.mkdir(parents=True, exist_ok=True)
        self.pdf = canvas.Canvas(str(destination), pagesize=(self.width, self.height), pageCompression=1)
        self.pdf.setTitle(f"COCONUT 제품설명서 | {self.meta['edition']}")
        self.pdf.setAuthor(self.company['info']['legalName'])
        self.pdf.setSubject('통합 인증, 서버 간 API, AI MCP 인증과 운영 기능 - 공개 배포용')
        self.pdf.setCreator('Fourberry COCONUT product guide')
        self.pdf.setKeywords('COCONUT, SSO, OAuth2, OIDC, API, MCP, 제품설명서')

    def text(self, text, x, y, size=11, width=None, bold=False, color=None, leading=None):
        """y는 윗변입니다. 높이를 돌려줘 후속 내용의 위치를 정합니다."""
        style = ParagraphStyle('body', fontName='GuideBold' if bold else 'Guide', fontSize=size,
                               leading=leading or size * 1.55, textColor=color or self.ink, splitLongWords=True)
        paragraph = Paragraph(escape(text).replace('\n', '<br/>'), style)
        _, height = paragraph.wrap(width or self.body_width, self.height)
        if y - height < 38:
            raise ValueError(f'페이지 {self.page}: 본문이 바닥을 벗어납니다: {text[:50]}')
        paragraph.drawOn(self.pdf, x, y - height)
        return height

    def box(self, x, y, w, h, fill=None, border=True, radius=10):
        self.pdf.setFillColor(fill or self.surface)
        self.pdf.setStrokeColor(self.line)
        self.pdf.roundRect(x, y, w, h, radius, stroke=int(border), fill=1)

    def begin(self, chapter, title, intro):
        self.page += 1
        c = self.pdf
        c.setFillColor(self.accent)
        c.rect(0, self.height - 6, self.width, 6, fill=1, stroke=0)
        self.text('COCONUT', self.margin, self.height - 22, 11, bold=True, color=self.accent)
        self.text(chapter, self.width - 270, self.height - 23, 9, width=228, color=self.muted)
        self.text(title, self.margin, self.height - 61, 25, bold=True)
        self.text(intro, self.margin, self.height - 106, 11, color=self.muted)
        c.setStrokeColor(self.line)
        c.line(self.margin, 35, self.width - self.margin, 35)
        c.setFont('Guide', 8)
        c.setFillColor(self.muted)
        c.drawString(self.margin, 15, f"COCONUT 제품설명서  |  {self.meta['updatedAt']} 개정")
        c.drawRightString(self.width - self.margin, 15, f"{self.page:02d} / {self.meta['pages']:02d}")
        c.bookmarkPage(f'page-{self.page}')
        c.addOutlineEntry(title, f'page-{self.page}')

    def end(self):
        self.pdf.showPage()

    def cards(self, items, top, columns=3, height=125):
        gap = 14
        width = (self.body_width - gap * (columns - 1)) / columns
        for i, item in enumerate(items):
            row, column = divmod(i, columns)
            x = self.margin + column * (width + gap)
            y = top - row * (height + gap)
            self.box(x, y - height, width, height)
            used = self.text(item['t'], x + 16, y - 15, 13, width - 32, True, self.accent)
            used += self.text(item['d'], x + 16, y - 23 - used, 10.5, width - 32)
            if used > height - 35:
                raise ValueError(f"페이지 {self.page}: 카드 내용 초과: {item['t']}")

    def screenshot(self, src, x, y, width, height):
        path = self.root / 'public' / src.lstrip('/')
        if path not in self.images:
            image = Image.open(path).convert('RGB')
            image.thumbnail((1800, 1500))
            encoded = io.BytesIO()
            image.save(encoded, format='JPEG', quality=84 if self.web else 94, optimize=True, subsampling=0)
            self.images[path] = (ImageReader(io.BytesIO(encoded.getvalue())), image.size)
        reader, (iw, ih) = self.images[path]
        scale = min((width - 16) / iw, (height - 16) / ih)
        w, h = iw * scale, ih * scale
        self.box(x, y, width, height, colors.white)
        self.pdf.drawImage(reader, x + (width - w) / 2, y + (height - h) / 2, w, h)

    def arrow(self, x1, y1, x2, y2, label, label_y):
        c = self.pdf
        c.setStrokeColor(self.accent)
        c.setLineWidth(1.5)
        c.line(x1, y1, x2, y2)
        sign = 1 if x2 > x1 else -1
        c.line(x2, y2, x2 - sign * 7, y2 + 4)
        c.line(x2, y2, x2 - sign * 7, y2 - 4)
        self.text(label, min(x1, x2), label_y, 9, abs(x2 - x1), color=self.accent)

    def flow(self, kind):
        flow = next(f for f in self.coco['flows'] if f['id'] == kind)
        intro = flow['intro']
        if kind == 'ai':
            intro = flow['status'] + ' | ' + self.coco['ai']['validation']
        self.begin({'user': '01  사용자 로그인', 'api': '02  서버 간 API', 'ai': '03  AI 도구 연결'}[kind], flow['title'], intro)
        if kind == 'user':
            nodes = [('사용자', '서비스에서 로그인 시작'), ('서비스 A·B', '코드 교환·토큰 검증·세션'), ('COCONUT', '계정 확인과 필요한 추가 단계')]
            notes = [
                {'t': '01 로그인 요청', 'd': self.coco['login'][0]['d']},
                {'t': '02 계정과 추가 단계', 'd': '계정을 확인하고 설정·기존 승인 상태에 따라 추가 인증과 접근 권한 동의를 진행합니다. 약관은 별도 절차입니다.'},
                {'t': '03 코드 교환·토큰 검증', 'd': self.coco['login'][4]['d']},
                {'t': '04 인증 세션 재사용', 'd': '같은 테넌트의 유효한 인증 세션이 있으면 재인증을 줄입니다. 서비스 B도 코드 교환·토큰 검증 후 자체 세션을 만듭니다.'},
            ]
        else:
            d = flow['diagram']
            nodes = [(d['requester'], d['requesterDetail']), ('COCONUT', d['issuerDetail']), (d['resource'], d['resourceDetail'])]
            notes = [{'t': f"0{i+1} {step['t']}", 'd': step['d']} for i, step in enumerate(flow['steps'])]
        width, gap = 210, (self.body_width - 630) / 2
        for i, (title, detail) in enumerate(nodes):
            x = self.margin + i * (width + gap)
            issuer = title == 'COCONUT'
            self.box(x, 350, width, 86, self.accent if issuer else self.surface, border=not issuer)
            self.text(title, x + 15, 421, 17, width - 30, True, colors.white if issuer else self.ink)
            self.text(detail, x + 15, 386, 10, width - 30, color=colors.white if issuer else self.muted)
        left_end = self.margin + width
        middle_start = left_end + gap
        if kind == 'user':
            self.arrow(left_end, 402, middle_start, 402, '01', 429)
            self.arrow(middle_start + width, 402, middle_start + width + gap, 402, '02', 429)
            self.arrow(middle_start + width + gap, 365, middle_start + width, 365, '03', 386)
            self.text('04 COCONUT 인증 세션 재사용 / 서비스 B도 코드 교환·토큰 검증·자체 세션 생성', self.margin, 333, 10, color=self.accent)
        else:
            self.arrow(left_end, 402, middle_start, 402, '01', 429)
            self.arrow(middle_start, 365, left_end, 365, '03' if kind == 'ai' else '02', 386)
            c = self.pdf
            x1, x2 = self.margin + width / 2, self.margin + 2 * (width + gap) + width / 2
            c.setStrokeColor(self.accent)
            for x_a, y_a, x_b, y_b in [(x1, 350, x1, 320), (x1, 320, x2, 320), (x2, 320, x2, 350), (x2, 350, x2-4, 343), (x2, 350, x2+4, 343)]:
                c.line(x_a, y_a, x_b, y_b)
            self.text('04 토큰을 담은 MCP 요청·서버 검증' if kind == 'ai' else '03 토큰을 담은 API 호출 / 04 서비스 권한 확인', 265, 341, 10, 400, color=self.accent)
        self.cards(notes, 299, columns=2, height=100)
        note = flow.get('note') or '같은 테넌트에서 인증 세션을 재사용하는 개념도입니다. 코드 교환 등 세부 요청은 생략했으며 재인증·동의 조건은 설정과 세션 상태에 따릅니다.'
        self.text(note, self.margin, 74, 9, color=self.muted)
        self.end()

    def build(self):
        self.begin(f"PRODUCT OVERVIEW  |  {self.meta['edition']}", '사람·서버·AI의 인증을 한곳에서.', 'COCONUT 제품설명서 - 최신 공개 기능과 관리자 화면')
        self.text(self.solution['desc'], self.margin, 430, 12, 330)
        self.text('인증은 COCONUT이,\n업무 권한은 서비스가.', self.margin, 310, 23, 330, True, self.accent)
        self.screenshot(self.coco['hero']['image'], 408, 250, self.width - 450, 200)
        self.text('테넌트는 조직별 관리 범위, 클라이언트는 연결할 웹·앱·API를 뜻합니다.', self.margin, 222, 10, color=self.muted)
        self.cards([{'t': f['k'], 'd': f['v']} for f in self.coco['facts']], 193, columns=4, height=96)
        self.text('수록 내용: 사용자 로그인 · 서버 간 API · AI MCP · 콘솔 설정 · 보안·운영 · 연동과 도입 조건', self.margin, 80, 10)
        self.text('화면은 2026년 11월 개발 환경 예시입니다. 표시된 수치·설정은 운영 실적이 아닙니다. AI MCP 인증은 개발 검증 중입니다.', self.margin, 58, 9, color=self.muted)
        self.end()
        for kind in ['user', 'api', 'ai']:
            self.flow(kind)

        for index in [0, 1]:
            screen = self.coco['tour'][index]
            self.begin(f'0{index+4}  관리자 콘솔', screen['h2'], screen['p'])
            self.screenshot(screen['full'], self.margin, 95, self.body_width, 350)
            self.text(' / '.join(screen['points']), self.margin, 77, 10, color=self.accent)
            self.end()

        self.begin('06  화면과 약관', '서비스 브랜드와 동의 절차를 구분합니다.', '브랜딩과 약관 관리는 서로 다른 설정입니다. 약관 동의와 API 접근 권한 동의를 혼동하지 않습니다.')
        col = (self.body_width - 18) / 2
        for i, screen in enumerate(self.coco['tour'][2:4]):
            x = self.margin + i * (col + 18)
            self.text(screen['h2'], x, 449, 14, col, True, self.accent)
            self.screenshot(screen['image'], x, 190, col, 220)
            self.text(screen['p'], x, 170, 10.5, col)
        self.text('공개 처리: 시험 서비스의 설정 영역만 사용했습니다. 실제 시크릿·연락처·접속 IP·계정 목록은 포함하지 않았습니다.', self.margin, 67, 9, color=self.muted)
        self.end()

        self.begin('07  보안과 운영', '로그인 이후의 접근도 관리합니다.', '계정·토큰·인증 세션을 관리하며, 서비스의 업무 권한과 외부 세션 종료는 서비스 측 연동으로 연결합니다.')
        self.cards(self.coco['security'], 445, columns=3, height=126)
        self.box(self.margin, 66, self.body_width, 102)
        self.text('운영 전에 함께 확인할 조건', self.margin + 16, 152, 13, bold=True, color=self.accent)
        self.text('외부 서비스 세션 종료는 서명된 웹훅 수신과 서비스 측 처리가 필요합니다. 장애 시 신규 로그인·토큰 갱신·기존 세션에 미치는 영향, 로그 보관·반출과 DB·서명 키의 백업·복구 기준을 함께 검토합니다.', self.margin + 16, 124, 11, self.body_width - 32)
        self.end()

        self.begin('08  연동과 실행 환경', '기본 제공과 사전 검토 범위를 구분합니다.', '기능 제공 상태와 서비스 측 연동·외부 계약·운영 검수는 구분해 확인합니다.')
        for i, item in enumerate(self.coco['compatibility']):
            y = 445 - i * 49
            self.text(item['t'], self.margin, y, 11, 174, True)
            self.text(item['status'], 225, y, 9.5, 175, color=self.accent)
            self.text(item['d'], 410, y, 9.5, self.width - 452)
            self.pdf.setStrokeColor(self.line)
            self.pdf.line(self.margin, y - 43, self.width - self.margin, y - 43)
        self.text(self.coco['spec'][1]['v'], self.margin, 151, 12, bold=True, color=self.accent)
        self.text(self.coco['spec'][0]['v'] + '. ' + self.coco['spec'][3]['v'] + '. ' + self.coco['spec'][4]['v'] + '.', self.margin, 122, 11)
        self.end()

        self.begin('09  도입과 문의', '시범 연동부터 단계적으로 전환합니다.', '기존 회원 데이터와 계정·권한 연결, 검수 기준과 원복 조건을 먼저 정합니다.')
        for i, item in enumerate(self.coco['adoption']):
            y = 445 - i * 52
            self.text(item['idx'], self.margin, y, 14, 35, True, self.accent)
            self.text(item['t'], 85, y, 12, 185, True)
            self.text(item['d'], 285, y, 10.5, self.width - 327)
        self.box(self.margin, 66, self.body_width, 108)
        info = self.company['info']
        self.text(f"{info['legalName']} | COCONUT 도입 상담", self.margin + 16, 159, 14, bold=True, color=self.accent)
        self.text(f"{info['email']}  /  {info['tel']}", self.margin + 16, 129, 11)
        url = self.company['url'] + '/solutions/coconut/'
        self.text(url, self.margin + 16, 104, 10, color=self.accent)
        self.pdf.linkURL(url, (self.margin + 16, 85, self.margin + 470, 108), relative=0)
        self.end()
        if self.page != self.meta['pages']:
            raise ValueError(f"페이지 수 불일치: {self.page} / {self.meta['pages']}")
        self.pdf.save()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--web', action='store_true', help='웹 배포용 JPEG 품질로 생성')
    args = parser.parse_args()
    Guide(args.site_root.resolve(), args.out.resolve(), args.web).build()
    print(f'{args.out}: {args.out.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
