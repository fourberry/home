import type { AiInquiryLocation } from '~/utils/inquiryAnalytics'

export const useAiWorkflowTracking = () => {
    const trackEntry = (location: 'home_section' | 'footer') => {
        useTrackEvent('ai_workflow_link_click', { link_location: location })
    }
    const trackNavigation = (destination: 'process' | 'experience' | 'principles' | 'questions' | 'work') => {
        useTrackEvent('ai_workflow_navigation', { destination })
    }
    const trackInquiry = (location: AiInquiryLocation) => {
        useTrackEvent('contact_cta_click', { inquiry_source: 'how_we_work', inquiry_location: location })
    }
    return { trackEntry, trackNavigation, trackInquiry }
}
