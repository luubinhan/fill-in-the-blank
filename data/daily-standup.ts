import { Level } from '../types';

export const DailyStandup = {
    name: 'Daily Standup',
    description: '',
    difficulty: 'medium',
    sentences: [
      {
        english: "Yesterday, I mainly focused on improving the login flow.",
        translation: "mainly focused on",
        vietnamese: "tập trung chủ yếu vào"
      },
      {
        english: "Today, I’ll continue working on the user profile feature and start adding tests.",
        translation: "continue working on",
        vietnamese: "tiếp tục làm việc về"
      },
      {
        english: "At the moment, I don’t see any blockers.",
        translation: "see",
        vietnamese: "thấy"
      },
      {
        english: "I’m planning to refactor the auth module this week.",
        translation: "m planning to",
        vietnamese: "có kế hoạch"
      },
      {
        english: "Just to make sure I understand correctly, the new flow only applies to logged-in users, right?",
        translation: "make sure",
        vietnamese: "đảm bảo"
      },
      {
        english: "How should we handle the case when the API returns an error?",
        translation: "handle the case",
        vietnamese: "xử lý trường hợp"
      },
      {
        english: "I’m assuming we don’t need to support mobile for this phase. Is that correct?",
        translation: "assuming",
        vietnamese: "giả sử"
      },
      {
        english: "Also, are there any performance or deadline constraints we should be aware of?",
        translation: "constraints",
        vietnamese: "ràng buộc"
      },
      {
        english: "I’ve made good progress on the dashboard feature.",
        translation: "ve made good progress",
        vietnamese: "đã tiến bộ tốt"
      },
      {
        english: "The main logic is done, and I’m polishing the UI now",
        translation: "polishing",
        vietnamese: "đang hoàn thiện"
      },
      {
        english: "If everything goes as planned, it should be ready by tomorrow.",
        translation: "goes as planned",
        vietnamese: "diễn ra như kế hoạch"
      },
      {
        english: "I’ve completed most of the feature, but I ran into some unexpected issues.",
        translation: "ran into",
        vietnamese: "gặp phải"
      },
      {
        english: "The API response was different from what we expected, so it took more time to adjust.",
        translation: "to adjust",
        vietnamese: "điều chỉnh"
      },
      {
        english: "I’m working on a workaround and should have an update later today.",
        translation: "workaround",
        vietnamese: "giải pháp thay thế"
      },
      {
        english: "Our error metrics to watch for",
        translation: "to watch for",
        vietnamese: "để theo dõi"
      },
      {
        english: "will help us spot any problems early",
        translation: "spot",
        vietnamese: "nhận ra"
      },
      {
        english: "we can narrow down the issue if it occurs",
        translation: "narrow down",
        vietnamese: "thu hẹp"
      },
      {
        english: "Everyone could hold their deployments today",
        translation: "hold",
        vietnamese: "hoãn"
      },
      {
        english: "Holding off on other deployments today will make it much easier to isolate any issues",
        translation: "isolate",
        vietnamese: "cô lập"
      },
      {
        english: "If anythings unclear, just let me know",
        translation: "unclear",
        vietnamese: "không rõ ràng"
      }
    ]
  } satisfies Level;
  