import { Level } from '../types';

export const DavinciResolve = {
    name: 'Davinci Resolve Shortcut',
    description: '',
    mode: 'fill-blank',
    sentences: [
      {
        english: "Tạo parralle node:  option +",
        translation: "p",
      },
      {
        english: "Tạo node color mới: option +",
        translation: "s",
      },
      {
        english: "Bật/tắt node color: command +",
        translation: "d",
      },
      {
        english: "Bật/tắt tất cả node color:  option +",
        translation: "d",
      },
      {
        english: "Chọn tất cả clip ở bên phải:",
        translation: "y",
      },
      {
        english: "Chọn tất cả clip ở bên trái: y +",
        translation: "command",
      },
      {
        english: "Chọn clip đang được selected bên phải: y +",
        translation: "option",
      },
      {
        english: "Chọn clip đang được selected bên trái: y",
        translation: "command option",
      },
      {
        english: "Chèn in/out point:",
        translation: "f10",
      },
    ]
  } satisfies Level;
  