import { Level } from '../types';

export const HowAreYou = {
    name: 'How Are You?',
    description: '',
    mode: 'fill-blank',
    sentences: [
      {
        english: "You know, same old, _same old_",
        translation: "same old",
        vietnamese: "cũng như mọi khi"
      },
      {
        english: "I can't complain",
        translation: "complain",
        vietnamese: "phàn nàn"
      },
      {
        english: "just living the dream ... you know",
        translation: "living",
        vietnamese: "sống"
      },
      {
        english: "another day, another dollar",
        translation: "day",
        vietnamese: "ngày"
      },
      {
        english: "well, better than I deserve",
        translation: "deserve",
        vietnamese: "xứng đáng"
      },
    ]
} satisfies Level;
  