import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";

// Import all Inngest functions here as they are implemented
// import { generateCertificate }      from "@/inngest/generate-certificate";
// import { sendEnrollmentEmail }      from "@/inngest/send-enrollment-email";
// import { courseCompletionCheck }    from "@/inngest/course-completion-check";
// import { recalculateLeaderboard }   from "@/inngest/recalculate-leaderboard";
// import { videoReadyNotification }   from "@/inngest/video-ready-notification";
// import { paymentInvoicePdf }        from "@/inngest/payment-invoice-pdf";
// import { weeklyProgressDigest }     from "@/inngest/weekly-progress-digest";
// import { liveClassReminder }        from "@/inngest/live-class-reminder";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Uncomment as functions are implemented:
    // generateCertificate,
    // sendEnrollmentEmail,
    // courseCompletionCheck,
    // recalculateLeaderboard,
    // videoReadyNotification,
    // paymentInvoicePdf,
    // weeklyProgressDigest,
    // liveClassReminder,
  ],
});
