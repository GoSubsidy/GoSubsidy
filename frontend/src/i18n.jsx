// ======================================================
// GoSubsidy - i18n Internationalization Configuration
// File: frontend/src/i18n.jsx
// ======================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        schemes: "Schemes",
        startups: "Startups",
        registration: "Registration",
        trademark: "Trademark",
        gst: "GST",
        incomeTax: "Income Tax",
        mca: "MCA",
        compliance: "Compliance",
        consultation: "Consultation",
        global: "Global",
        loans: "Loans",
        insurance: "Insurance",
        emiCalculator: "EMI Calculator",
        dpr: "Detailed Project Report",
        cibil: "CIBIL",
        talkToExpert: "Talk to Expert",
        login: "Login",
        register: "Register"
      },
      categories: {
        schemesDesc: "Government subsidy & scheme discovery",
        startupsDesc: "Choose the right business structure",
        registrationDesc: "Business registrations & licenses",
        trademarkDesc: "Trademark, copyright, design & patent",
        gstDesc: "GST registration, returns & notices",
        loansDesc: "Explore business & financial funding",
        insuranceDesc: "Protect your business & assets",
        dprDesc: "Prepare your project report"
      },
      dpr: {
        title: "Detailed Project Report",
        subtitle: "Create your DPR step-by-step with project, loan, asset and financial information.",
        businessInfo: "Business Info",
        loanDetails: "Loan Details",
        fixedAssets: "Fixed Assets",
        financials: "Financials",
        promoter: "Promoter",
        preview: "Preview",
        generatePremiumDpr: "Generate Premium DPR",
        saveDraft: "Save Draft",
        next: "Next",
        back: "Back"
      }
    }
  },
  te: {
    translation: {
      nav: {
        home: "హోమ్",
        schemes: "పథకాలు",
        startups: "స్టార్టప్‌లు",
        registration: "రిజిస్ట్రేషన్",
        trademark: "ట్రేడ్‌మార్క్",
        gst: "GST",
        incomeTax: "ఆదాయపు పన్ను",
        mca: "MCA",
        compliance: "కంప్లైయన్స్",
        consultation: "సలహా",
        global: "గ్లోబల్",
        loans: "రుణాలు",
        insurance: "భీమా",
        emiCalculator: "EMI కాలిక్యులేటర్",
        dpr: "ప్రాజెక్ట్ నివేదిక (DPR)",
        cibil: "సిబిల్ (CIBIL)",
        talkToExpert: "నిపుణులతో మాట్లాడండి",
        login: "లాగిన్",
        register: "నమోదు చేయండి"
      },
      categories: {
        schemesDesc: "ప్రభుత్వ సబ్సిడీ & పథకాల అన్వేషణ",
        startupsDesc: "సరైన వ్యాపార నిర్మాణాన్ని ఎంచుకోండి",
        registrationDesc: "వ్యాపార రిజిస్ట్రేషన్లు & లైసెన్సులు",
        trademarkDesc: "ట్రేడ్‌మార్క్, కాపీరైట్ & పేటెంట్",
        gstDesc: "GST రిజిస్ట్రేషన్ మరియు రిటర్న్స్",
        loansDesc: "వ్యాపార & ఆర్థిక నిధులను అన్వేషించండి",
        insuranceDesc: "మీ వ్యాపారం & ఆస్తులను రక్షించండి",
        dprDesc: "మీ ప్రాజెక్ట్ నివేదికను సిద్ధం చేయండి"
      },
      dpr: {
        title: "వివరణాత్మక ప్రాజెక్ట్ నివేదిక (DPR)",
        subtitle: "ప్రాజెక్ట్, రుణం, ఆస్తులు మరియు ఆర్థిక సమాచారంతో దశలవారీగా మీ DPRని సృష్టించండి.",
        businessInfo: "వ్యాపార సమాచారం",
        loanDetails: "రుణ వివరాలు",
        fixedAssets: "స్థిర ఆస్తులు",
        financials: "ఆర్థిక వివరాలు",
        promoter: "ప్రమోటర్",
        preview: "ముందస్తు పరిశీలన",
        generatePremiumDpr: "ప్రీమియం DPRని సృష్టించండి",
        saveDraft: "డ్రాఫ్ట్‌ను సేవ్ చేయండి",
        next: "తదుపరి",
        back: "వెనుకకు"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        schemes: "योजनाएं",
        startups: "स्टार्टअप",
        registration: "पंजीकरण",
        trademark: "ट्रेडमार्क",
        gst: "जीएसटी (GST)",
        incomeTax: "आयकर",
        mca: "एमसीए (MCA)",
        compliance: "अनुपालन",
        consultation: "परामर्श",
        global: "ग्लोबल",
        loans: "ऋण",
        insurance: "बीमा",
        emiCalculator: "EMI कैलकुलेटर",
        dpr: "विस्तृत परियोजना रिपोर्ट",
        cibil: "सिबिल (CIBIL)",
        talkToExpert: "विशेषज्ञ से बात करें",
        login: "लॉगिन",
        register: "पंजीकरण करें"
      },
      categories: {
        schemesDesc: "सरकारी सब्सिडी और योजना खोज",
        startupsDesc: "सही व्यवसाय संरचना चुनें",
        registrationDesc: "व्यवसाय पंजीकरण और लाइसेंस",
        trademarkDesc: "ट्रेडमार्क, कॉपीराइट और पेटेंट",
        gstDesc: "जीएसटी पंजीकरण, रिटर्न और नोटिस",
        loansDesc: "व्यापार और वित्तीय फंडिंग का पता लगाएं",
        insuranceDesc: "अपने व्यवसाय और संपत्तियों की रक्षा करें",
        dprDesc: "अपनी परियोजना रिपोर्ट तैयार करें"
      },
      dpr: {
        title: "विस्तृत परियोजना रिपोर्ट (DPR)",
        subtitle: "परियोजना, ऋण, संपत्ति और वित्तीय जानकारी के साथ चरण-दर-चरण अपनी DPR बनाएं।",
        businessInfo: "व्यापार जानकारी",
        loanDetails: "ऋण विवरण",
        fixedAssets: "स्थिर संपत्ति",
        financials: "वित्तीय विवरण",
        promoter: "प्रमोटर",
        preview: "पूर्वावलोकन",
        generatePremiumDpr: "प्रीमियम DPR जेनरेट करें",
        saveDraft: "ड्राफ्ट सहेजें",
        next: "अगला",
        back: "वापस"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
