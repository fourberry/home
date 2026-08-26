<template>
    <section id="contact" class="section section--ink">
        <div class="container">
            <div class="contact-grid">
                <div v-reveal class="contact-head">
                    <span class="eyebrow">Contact · 문의</span>
                    <h2>성공적인 파트너가<br />기다리고 있습니다.</h2>
                    <p class="lead">프로젝트 구축, 솔루션 도입, IT 컨설팅 — 무엇이든 지금 바로 문의하세요.</p>
                    <div class="contact-info">
                        <div class="ci-row">
                            <div class="ci-k">Company</div>
                            <div class="ci-v">포베리주식회사 · (주)포베리</div>
                        </div>
                        <div class="ci-row">
                            <div class="ci-k">Address</div>
                            <div class="ci-v">서울특별시 영등포구 양평로 22길 21<br />코오롱디지털타워 1409호 (선유도 인근)</div>
                        </div>
                        <div class="ci-row">
                            <div class="ci-k">Tel</div>
                            <div class="ci-v"><a href="tel:01027550650" @click="trackContactChannel('tel')">010-2755-0650</a></div>
                        </div>
                        <div class="ci-row">
                            <div class="ci-k">Email</div>
                            <div class="ci-v"><a href="mailto:fourberry@fourberry.co.kr" @click="trackContactChannel('email')">fourberry@fourberry.co.kr</a></div>
                        </div>
                    </div>
                    <ClientOnly><FbMap /></ClientOnly>
                </div>

                <form v-reveal class="form-card" @submit.prevent="handleSubmit">
                    <h3>상담 문의</h3>
                    <p class="fc-sub">어떤 유형의 상담을 원하시나요? 필수 선택 📌</p>

                    <div class="field">
                        <div class="chips">
                            <button
                                v-for="t in consultationTypes"
                                :key="t.value"
                                type="button"
                                class="chip"
                                :class="{ on: selectedType === t.value }"
                                @click="selectedType = t.value"
                            >
                                {{ t.label }}
                            </button>
                        </div>
                    </div>

                    <div class="field">
                        <label>관심 서비스 <span class="opt">다중 선택</span></label>
                        <div class="chips">
                            <button
                                v-for="s in favoriteServices"
                                :key="s.value"
                                type="button"
                                class="chip"
                                :class="{ on: selectedServices.includes(s.value) }"
                                @click="toggleService(s.value)"
                            >
                                {{ s.label }}
                            </button>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label for="fb-company">회사/단체명</label>
                            <input id="fb-company" v-model="clientInfo.company" type="text" maxlength="50" placeholder="포베리" />
                        </div>
                        <div class="field">
                            <label for="fb-name">담당자명 <span class="req">*</span></label>
                            <input id="fb-name" v-model="clientInfo.name" type="text" maxlength="30" placeholder="홍길동" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label for="fb-tel">연락처 <span class="req">*</span></label>
                            <input id="fb-tel" v-model="clientInfo.tel" type="tel" maxlength="11" placeholder="01000000000" />
                        </div>
                        <div class="field">
                            <label for="fb-email">이메일 <span class="req">*</span></label>
                            <input id="fb-email" v-model="clientInfo.email" type="email" maxlength="100" placeholder="name@company.com" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label for="fb-budget">예산</label>
                            <select id="fb-budget" v-model="selectedBudget">
                                <option value="">예산을 선택하세요</option>
                                <option v-for="b in budgetOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label for="fb-schedule">일정</label>
                            <select id="fb-schedule" v-model="selectedSchedule">
                                <option value="">일정을 선택하세요</option>
                                <option v-for="s in scheduleOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="field">
                        <label for="fb-message">문의 내용</label>
                        <textarea
                            id="fb-message"
                            v-model="textareaContent"
                            maxlength="4000"
                            placeholder="예: 프로젝트 개요, 요구사항 등 — 구체적인 내용을 적어주시면 이해하는 데 도움이 됩니다."
                        ></textarea>
                        <div class="field-count">{{ textareaContent.length }}/4000자</div>
                    </div>

                    <div class="field fb-upload">
                        <label>파일 첨부</label>
                        <FormFileUpload
                            id="fb-files"
                            v-model="selectedFiles"
                            label="파일 선택 (선택)"
                            :max-files="5"
                            :max-size-mb="10"
                        />
                    </div>

                    <div class="field agree">
                        <input id="fb-privacy" v-model="isPrivacyAgreed" type="checkbox" />
                        <label for="fb-privacy">
                            <a href="#" @click.prevent="showPrivacy = true">개인정보보호정책</a>에 동의합니다.
                            <span class="req">*</span>
                        </label>
                    </div>

                    <button class="btn btn-primary form-submit" type="submit" :disabled="isLoading">
                        {{ isLoading ? '전송 중…' : '문의 보내기 →' }}
                    </button>
                    <p class="form-note">문의 내용은 담당자 확인 후 순차적으로 회신드립니다.</p>
                </form>
            </div>
        </div>

        <FbDialog :show="showModal" :title="modalTitle" @close="closeModal">
            <p>{{ modalMessage }}</p>
        </FbDialog>

        <FbDialog :show="showPrivacy" title="개인정보보호정책" @close="showPrivacy = false">
            <p>
                <b>제1조 (총칙)</b><br />
                주식회사 포베리(이하 '회사'라 함)는 이용자의 개인정보를 중요시하며, '개인정보 보호법', '정보통신망 이용촉진
                및 정보보호 등에 관한 법률' 등 관련 법령을 준수하고 있습니다.
            </p>
            <p>
                <b>제2조 (수집하는 개인정보의 항목)</b><br />
                회사는 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br />
                - 필수항목 : 담당자명, 연락처, 이메일<br />
                - 선택항목 : 회사/단체명, 상담내용, 첨부파일<br />
                <br />
                또한 서비스 이용 과정에서 아래 정보가 자동으로 생성·수집될 수 있습니다.<br />
                - 방문 일시, 방문한 페이지 및 이용 기록, 브라우저 및 기기 정보(OS·화면 크기 등), 접속 국가·도시 수준의 지역
                정보, 유입 경로, 쿠키를 통해 생성된 식별자
            </p>
            <p>
                <b>제3조 (개인정보의 수집 및 이용목적)</b><br />
                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
                - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br />
                - 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송<br />
                - 회원 관리: 본인확인, 개인 식별, 부정 이용 방지, 민원처리, 고지사항 전달<br />
                - 마케팅 및 광고에 활용: 신규 서비스 개발, 이벤트 등 광고성 정보 전달, 이용 통계
            </p>
            <p>
                <b>제4조 (개인정보의 보유 및 이용기간)</b><br />
                회사는 원칙적으로 개인정보의 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만 아래의
                경우에는 명시한 기간 동안 보존합니다.<br />
                - 문의·상담 기록 : 문의 처리 완료 후 3년<br />
                - 관련 법령에서 보존을 요구하는 경우 : 해당 법령에서 정한 기간
            </p>
            <p>
                <b>제5조 (개인정보의 파기절차 및 방법)</b><br />
                ① 파기절차 : 보유기간이 경과하거나 처리목적이 달성된 개인정보는 지체 없이(정당한 사유가 없는 한 5일 이내)
                파기합니다.<br />
                <br />
                ② 파기방법 : 전자적 파일 형태로 저장된 개인정보는 복구·재생할 수 없는 기술적 방법으로 영구 삭제하며, 종이
                문서에 기록된 개인정보는 분쇄하거나 소각하여 파기합니다.
            </p>
            <p>
                <b>제6조 (정보주체의 권리·의무 및 행사방법)</b><br />
                ① 이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 회사에 요구할 수 있습니다.<br />
                <br />
                ② 제1항에 따른 권리 행사는 서면, 이메일 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이
                조치합니다.<br />
                <br />
                ③ 권리 행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여도 하실 수 있습니다.<br />
                <br />
                ④ 개인정보의 열람 및 처리정지 요구는 관련 법령에서 정하는 바에 따라 제한될 수 있습니다.
            </p>
            <p>
                <b>제7조 (쿠키 등 자동수집장치의 설치·운영 및 거부)</b><br />
                ① 회사는 웹사이트 이용 통계를 분석하기 위해 Google LLC의 Google Analytics를 사용하며, 이 과정에서
                쿠키(cookie)를 사용합니다.<br />
                <br />
                ② 쿠키는 웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일로, 회사는 이를 통해 방문자 수·이용 패턴 등을
                파악하여 서비스 개선에 활용합니다. 이름·연락처·이메일 등 개인을 식별할 수 있는 정보는 Google Analytics로
                전송하지 않습니다.<br />
                <br />
                ③ 이용자는 쿠키 설치에 대한 선택권을 가지며, 아래 방법으로 이를 거부할 수 있습니다.<br />
                - 브라우저 설정에서 쿠키 저장을 거부하거나 저장 시마다 확인을 거치도록 변경<br />
                - Google Analytics 차단 브라우저 부가기능 설치 (<a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    >tools.google.com/dlpage/gaoptout</a
                >)<br />
                <br />
                ④ 다만 쿠키 저장을 거부할 경우 웹사이트 일부 기능의 이용에 어려움이 있을 수 있습니다.
            </p>
            <p>
                <b>제8조 (개인정보의 국외 이전)</b><br />
                회사는 웹사이트 이용 통계 분석을 위해 아래와 같이 개인정보를 국외로 이전하고 있습니다.<br />
                - 이전받는 자 : Google LLC<br />
                - 이전 국가 : 미국<br />
                - 이전 항목 : 쿠키를 통해 생성된 식별자, 방문 일시 및 페이지 이용 기록, 브라우저·기기 정보, 접속 지역 정보<br />
                - 이전 일시 및 방법 : 서비스 이용 시점에 네트워크를 통해 전송<br />
                - 이용 목적 : 웹사이트 이용 통계 분석 및 서비스 개선<br />
                - 보유·이용 기간 : 이벤트 데이터 2개월, 사용자 데이터 14개월(재방문 시 갱신)
            </p>
            <p>
                <b>제9조 (개인정보 보호책임자)</b><br />
                ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를
                위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br />
                - 성명 · 직책 : 우대식 / 대표이사<br />
                - 연락처 : 010-2755-0650, fourberry@fourberry.co.kr<br />
                <br />
                ② 이용자는 서비스를 이용하면서 발생한 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보
                보호책임자에게 문의하실 수 있습니다.<br />
                <br />
                ③ 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.<br />
                - 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)<br />
                - 개인정보 분쟁조정위원회 (kopico.go.kr / 1833-6972)<br />
                - 대검찰청 사이버범죄수사단 (spo.go.kr / 1301)<br />
                - 경찰청 사이버수사국 (ecrm.police.go.kr / 국번없이 182)
            </p>
            <p>
                <b>제10조 (개인정보 처리방침의 변경)</b><br />
                이 개인정보 처리방침은 2026년 8월 12일부터 적용됩니다. 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제
                및 수정이 있을 경우에는 변경사항의 시행일 최소 7일 전부터 웹사이트를 통하여 고지합니다.
            </p>
        </FbDialog>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormFileUpload from '~/components/contact/FormFileUpload.vue'

const consultationTypes = [
    { value: 'TYPE_01', label: '신규 시스템 구축' },
    { value: 'TYPE_02', label: '시스템 유지보수' },
    { value: 'TYPE_03', label: '솔루션 도입' },
    { value: 'TYPE_04', label: 'AI 도입' },
    { value: 'TYPE_05', label: '홈페이지 구축' },
    { value: 'TYPE_06', label: '기타 일반 문의' },
]

const favoriteServices = [
    { value: 'SERVICE_01', label: '통합 인증 (SSO)' },
    { value: 'SERVICE_02', label: '데이터 스크래퍼' },
    { value: 'SERVICE_03', label: '통합 메시징 (UMS)' },
    { value: 'SERVICE_04', label: '쇼핑몰 구축·운영' },
    { value: 'SERVICE_05', label: '주문 관리 (OMS)' },
    { value: 'SERVICE_06', label: '기타 시스템 개발' },
]

const budgetOptions = [
    { value: '1000', label: '1000만원 미만' },
    { value: '5000', label: '5000만원 미만' },
    { value: '10000', label: '1억원 미만' },
    { value: '30000', label: '3억원 미만' },
    { value: '50000', label: '5억원 미만' },
    { value: '70000', label: '7억원 미만' },
    { value: '0', label: '미정' },
]

const scheduleOptions = [
    { value: 'one_month', label: '1개월 이내' },
    { value: 'three_months', label: '3개월 이내' },
    { value: 'six_months', label: '6개월 이내' },
    { value: 'one_year', label: '1년 이내' },
    { value: 'more_than_one_year', label: '1년 이상' },
    { value: 'undecided', label: '미정' },
]

const selectedType = ref('')
const selectedServices = ref<string[]>([])
const selectedBudget = ref('')
const selectedSchedule = ref('')
const textareaContent = ref('')
const selectedFiles = ref<File[]>([])
const isPrivacyAgreed = ref(false)
const isLoading = ref(false)

const clientInfo = ref({ company: '', name: '', tel: '', email: '' })

// 문의 전송 엔드포인트 — nuxt.config.ts runtimeConfig.public.contactEndpoint
// 기본값 '/api/contact' (Nitro 서버 라우트). 정적 배포에서는 Worker 주소로 교체.
const contactEndpoint = (useRuntimeConfig().public.contactEndpoint as string) || '/api/contact'

// 폼 대신 전화·이메일로 직접 연락하는 방문자 규모를 파악하기 위한 GA4 이벤트.
// tel:·mailto: 는 GA 의 이탈 클릭(자동 수집) 대상이 아니라 직접 심어야 합니다.
const trackContactChannel = (channel: 'tel' | 'email') => {
    useTrackEvent('contact_channel_click', { channel, link_location: 'contact_section' })
}

const showModal = ref(false)
const showPrivacy = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const submissionStatus = ref<'success' | 'error' | 'validation' | null>(null)

const toggleService = (v: string) => {
    const i = selectedServices.value.indexOf(v)
    if (i === -1) selectedServices.value.push(v)
    else selectedServices.value.splice(i, 1)
}

const openModal = (title: string, message: string, status: 'success' | 'error' | 'validation') => {
    modalTitle.value = title
    modalMessage.value = message
    submissionStatus.value = status
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    if (submissionStatus.value === 'success') resetForm()
    submissionStatus.value = null
}

const resetForm = () => {
    selectedType.value = ''
    selectedServices.value = []
    selectedBudget.value = ''
    selectedSchedule.value = ''
    textareaContent.value = ''
    selectedFiles.value = []
    isPrivacyAgreed.value = false
    clientInfo.value = { company: '', name: '', tel: '', email: '' }
}

const validateForm = (): boolean => {
    if (!selectedType.value) {
        openModal('입력 확인', '어떤 유형의 상담을 원하시나요? (필수)', 'validation')
        return false
    }
    const telRegex = /^\d{10,11}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!clientInfo.value.name.trim()) {
        openModal('입력 확인', '담당자명은 필수입니다.', 'validation')
        return false
    }
    if (!clientInfo.value.tel.trim() || !telRegex.test(clientInfo.value.tel)) {
        openModal('입력 확인', '유효한 연락처를 입력해주세요. (10~11자리 숫자)', 'validation')
        return false
    }
    if (!clientInfo.value.email.trim() || !emailRegex.test(clientInfo.value.email)) {
        openModal('입력 확인', '유효한 이메일을 입력해주세요.', 'validation')
        return false
    }
    if (!isPrivacyAgreed.value) {
        openModal('입력 확인', '개인정보보호정책에 동의해주세요.', 'validation')
        return false
    }
    return true
}

/** File → Base64 (data URL 접두사 제거) */
const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            if (typeof result !== 'string' || !result.includes(',')) {
                reject(new Error('Failed to read file as base64 data URL.'))
                return
            }
            const base64Content = result.split(',')[1]
            if (base64Content) resolve(base64Content)
            else reject(new Error('Failed to extract base64 content from data URL.'))
        }
        reader.onerror = error => reject(error)
        reader.readAsDataURL(file)
    })
}

/**
 * 라임에 등록된 문의 메일 템플릿 ID.
 *
 * 메일의 문구·디자인은 라임 [템플릿 관리] 에 있고, 여기서는 **값만** 보냅니다.
 * 값의 HTML 이스케이프도 라임이 합니다 — 여기서 미리 escape 하면 이중 이스케이프가 돼
 * 메일에 `&amp;lt;` 같은 문자가 그대로 보입니다.
 */
const CONTACT_TEMPLATE_ID = 'HOMEPAGE_CONTACT'

const handleSubmit = async () => {
    if (isLoading.value) return
    if (!validateForm()) return

    isLoading.value = true

    try {
        const attachments = await Promise.all(
            selectedFiles.value.map(async file => ({
                filename: file.name,
                mimeType: file.type || 'application/octet-stream',
                content: await readFileAsBase64(file),
            }))
        )

        const typeLabel = consultationTypes.find(t => t.value === selectedType.value)?.label || 'N/A'
        const serviceLabels =
            selectedServices.value
                .map(val => favoriteServices.find(s => s.value === val)?.label)
                .filter(Boolean)
                .join(', ') || 'N/A'
        const budgetLabel = budgetOptions.find(b => b.value === selectedBudget.value)?.label || 'N/A'
        const scheduleLabel = scheduleOptions.find(s => s.value === selectedSchedule.value)?.label || 'N/A'

        // 메일 본문·제목은 라임 템플릿(HOMEPAGE_CONTACT)에 있습니다. 여기서는 값만 넘깁니다.
        // 값을 미리 escape 하지 마세요 — 라임이 Handlebars 로 치환하면서 이스케이프합니다.
        const requestBody = {
            templateId: CONTACT_TEMPLATE_ID,
            data: {
                // 제목·인사말에 쓰는 표시용 이름. 회사명이 없으면 담당자명으로 대체합니다.
                clientLabel: clientInfo.value.company || clientInfo.value.name,
                clientCompany: clientInfo.value.company || 'N/A',
                clientName: clientInfo.value.name,
                clientTel: clientInfo.value.tel,
                clientEmail: clientInfo.value.email,
                inquiryType: typeLabel,
                services: serviceLabels,
                budget: budgetLabel,
                schedule: scheduleLabel,
                message: textareaContent.value || 'N/A',
                attachmentNames: attachments.length > 0 ? attachments.map(a => a.filename).join(', ') : '없음',
            },
            attachments,
        }

        // 수신자 주소·API 키는 프록시 서버가 가지고 있습니다 (클라이언트 번들에 노출되지 않음).
        await $fetch(contactEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
        })

        // GA4 전환 이벤트. 이름·연락처 등 개인정보는 보내지 않고 선택 항목만 담습니다
        // (GA 정책상 개인 식별 정보 전송 금지). GTAG_ID 가 비어 있으면 no-op 입니다.
        useTrackEvent('generate_lead', {
            inquiry_type: typeLabel,
            services: serviceLabels,
            budget: budgetLabel,
            schedule: scheduleLabel,
            has_attachment: attachments.length > 0,
        })

        openModal('전송 완료', '문의가 성공적으로 전송되었습니다. 감사합니다.', 'success')
    } catch (error) {
        console.error('문의 전송 실패:', error)
        // 프록시 장애를 통계로도 감지할 수 있게 실패도 기록합니다.
        useTrackEvent('contact_submit_failed', { inquiry_type: selectedType.value || 'unknown' })
        openModal('전송 실패', '문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error')
    } finally {
        isLoading.value = false
    }
}
</script>
