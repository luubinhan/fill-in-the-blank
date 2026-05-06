import { Level } from '../types';

export const SPEAKING_LEVELS: Level[] = [
  {
    name: 'Introducing Yourself',
    description: 'Basic phrases for introducing yourself in conversation',
    difficulty: 'easy',
    sentences: [
      { english: 'My name is John and I am a software engineer.', translation: 'Tên tôi là John và tôi là kỹ sư phần mềm.' },
      { english: 'I have been working in this field for five years.', translation: 'Tôi đã làm việc trong lĩnh vực này được năm năm.' },
      { english: 'I am originally from Hanoi but now I live in Saigon.', translation: 'Tôi quê ở Hà Nội nhưng bây giờ tôi sống ở Sài Gòn.' },
      { english: 'Nice to meet you, I look forward to working together.', translation: 'Rất vui được gặp bạn, tôi mong chúng ta cùng làm việc.' },
    ],
  },
  {
    name: 'Asking for Clarification',
    description: 'Polite ways to ask someone to repeat or explain',
    difficulty: 'medium',
    sentences: [
      { english: 'Could you please repeat that?', translation: 'Bạn có thể nhắc lại không?' },
      { english: 'I am not sure I understood correctly.', translation: 'Tôi không chắc mình hiểu đúng không.' },
      { english: 'What exactly do you mean by that?', translation: 'Bạn có ý gì khi nói vậy?' },
      { english: 'Can you give me an example?', translation: 'Bạn có thể cho tôi một ví dụ không?' },
      { english: 'Sorry, could you speak a little more slowly?', translation: 'Xin lỗi, bạn có thể nói chậm hơn một chút không?' },
    ],
  },
  {
    name: 'Expressing Opinions',
    description: 'Phrases for sharing and defending your point of view',
    difficulty: 'hard',
    sentences: [
      { english: 'In my opinion, this approach has several drawbacks.', translation: 'Theo tôi, cách tiếp cận này có một số nhược điểm.' },
      { english: 'I strongly believe that communication is key.', translation: 'Tôi tin chắc rằng giao tiếp là chìa khóa.' },
      { english: 'From my perspective, the data supports a different conclusion.', translation: 'Từ quan điểm của tôi, dữ liệu hỗ trợ một kết luận khác.' },
      { english: 'I see your point, but I would argue otherwise.', translation: 'Tôi hiểu ý bạn, nhưng tôi lại có lập luận khác.' },
      { english: 'That is a valid point, and I would like to add that...', translation: 'Đó là một điểm hợp lý, và tôi muốn bổ sung rằng...' },
    ],
  },
];
