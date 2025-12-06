import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 'lvl_1',
    name: 'Beginner Explorer',
    description: 'Short and sweet sentences for starting out.',
    difficulty: 'easy',
    color: 'bg-green-100 text-green-700',
    accentColor: 'border-green-400',
    sentences: [
      {
        id: '1',
        english: "The cat sleeps.",
        translation: "The kitty is taking a nap.",
        difficulty: 'easy'
      },
      {
        id: '2',
        english: "I like apples.",
        translation: "My favorite fruit is red and crunchy.",
        difficulty: 'easy'
      },
      {
        id: '3',
        english: "The sun is hot.",
        translation: "It is warm outside today.",
        difficulty: 'easy'
      },
      {
        id: '4',
        english: "My dog runs fast.",
        translation: "My puppy moves very quickly.",
        difficulty: 'easy'
      },
      {
        id: '5',
        english: "She has a red ball.",
        translation: "She is playing with a round toy.",
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'lvl_2',
    name: 'Sentence Builder',
    description: 'Longer sentences with more details.',
    difficulty: 'medium',
    color: 'bg-blue-100 text-blue-700',
    accentColor: 'border-blue-400',
    sentences: [
      {
        id: '6',
        english: "The big yellow sun shines brightly.",
        translation: "It is a very sunny and bright day.",
        difficulty: 'medium'
      },
      {
        id: '7',
        english: "My brother plays soccer on Saturday.",
        translation: "He kicks the ball on the weekend.",
        difficulty: 'medium'
      },
      {
        id: '8',
        english: "We are going to the zoo tomorrow.",
        translation: "We will see lions and tigers soon.",
        difficulty: 'medium'
      },
      {
        id: '9',
        english: "Can you help me find my shoes?",
        translation: "I lost my sneakers, do you see them?",
        difficulty: 'medium'
      },
      {
        id: '10',
        english: "Birds fly high in the blue sky.",
        translation: "Animals with wings go up in the air.",
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'lvl_3',
    name: 'Master Storyteller',
    description: 'Complex sentences for super learners!',
    difficulty: 'hard',
    color: 'bg-purple-100 text-purple-700',
    accentColor: 'border-purple-400',
    sentences: [
      {
        id: '11',
        english: "Please clean your room before we eat dinner.",
        translation: "Make sure your toys are put away first.",
        difficulty: 'hard'
      },
      {
        id: '12',
        english: "She forgot to bring her umbrella to school.",
        translation: "It rained and she got wet without it.",
        difficulty: 'hard'
      },
      {
        id: '13',
        english: "The library is a quiet place to read books.",
        translation: "You must whisper when you are there.",
        difficulty: 'hard'
      },
      {
        id: '14',
        english: "Learning a new language opens many exciting doors.",
        translation: "Knowing English helps you make new friends.",
        difficulty: 'hard'
      }
    ]
  }
];