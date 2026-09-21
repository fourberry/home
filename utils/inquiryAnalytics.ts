export type AiInquiryLocation = 'hero' | 'cta_band'

// 내부 이동에 UTM을 쓰지 않습니다. 고정된 값만 전달해 외부 유입 출처와 구분합니다.
export const aiInquiryHref = (location: AiInquiryLocation) => `/?inquiry_source=how_we_work&inquiry_location=${location}#contact`

// URL 원문·임의 문자열·중복 파라미터를 GA로 전달하지 않습니다.
export const inquiryAttribution = (query: Record<string, unknown>) => {
    if (query.inquiry_source !== 'how_we_work') {
        return { inquiry_source: 'unattributed', inquiry_location: 'unknown' }
    }
    return {
        inquiry_source: 'how_we_work',
        inquiry_location: query.inquiry_location === 'hero' || query.inquiry_location === 'cta_band' ? query.inquiry_location : 'unknown',
    }
}
