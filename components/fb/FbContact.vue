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
                            <div class="ci-v"><a href="tel:01027550650">010-2755-0650</a></div>
                        </div>
                        <div class="ci-row">
                            <div class="ci-k">Email</div>
                            <div class="ci-v"><a href="mailto:fourberry@fourberry.co.kr">fourberry@fourberry.co.kr</a></div>
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
                - 선택항목 : 회사/단체명, 상담내용, 첨부파일
            </p>
            <p>
                <b>제3조 (개인정보의 수집 및 이용목적)</b><br />
                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
                - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br />
                - 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송<br />
                - 회원 관리: 본인확인, 개인 식별, 부정 이용 방지, 민원처리, 고지사항 전달<br />
                - 마케팅 및 광고에 활용: 신규 서비스 개발, 이벤트 등 광고성 정보 전달, 이용 통계
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

const escapeHTML = (str: string) =>
    str.replace(
        /[&<>"']/g,
        match =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[match]!
    )

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

        const htmlContent = `
            <h1>[포베리] 신규 문의가 접수되었습니다.</h1>
            <p><strong>${escapeHTML(clientInfo.value.company || clientInfo.value.name)}</strong>님으로부터 새로운 문의가 접수되었습니다.</p>
            <hr>
            <h2>문의자 정보</h2>
            <ul>
                <li><strong>회사/단체명:</strong> ${escapeHTML(clientInfo.value.company) || 'N/A'}</li>
                <li><strong>담당자명:</strong> ${escapeHTML(clientInfo.value.name)}</li>
                <li><strong>연락처:</strong> ${escapeHTML(clientInfo.value.tel)}</li>
                <li><strong>이메일:</strong> ${escapeHTML(clientInfo.value.email)}</li>
            </ul>
            <hr>
            <h2>문의 내용</h2>
            <ul>
                <li><strong>상담 유형:</strong> ${escapeHTML(typeLabel)}</li>
                <li><strong>관심 서비스:</strong> ${escapeHTML(serviceLabels)}</li>
                <li><strong>예산:</strong> ${escapeHTML(budgetLabel)}</li>
                <li><strong>일정:</strong> ${escapeHTML(scheduleLabel)}</li>
            </ul>
            <hr>
            <h3>추가 전달 내용</h3>
            <pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${escapeHTML(textareaContent.value) || 'N/A'}</pre>
            <hr>
            <p>첨부파일: ${attachments.length > 0 ? escapeHTML(attachments.map(a => a.filename).join(', ')) : '없음'}</p>
        `

        const requestBody = {
            subject: `[포베리 문의] ${clientInfo.value.company || clientInfo.value.name} 님 - ${typeLabel}`,
            content: htmlContent,
            data: {
                clientName: clientInfo.value.name,
                clientCompany: clientInfo.value.company,
                inquiryType: typeLabel,
            },
            attachments,
        }

        // 수신자 주소·API 키는 프록시 서버가 가지고 있습니다 (클라이언트 번들에 노출되지 않음).
        await $fetch(contactEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
        })

        openModal('전송 완료', '문의가 성공적으로 전송되었습니다. 감사합니다.', 'success')
    } catch (error) {
        console.error('문의 전송 실패:', error)
        openModal('전송 실패', '문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error')
    } finally {
        isLoading.value = false
    }
}
</script>
