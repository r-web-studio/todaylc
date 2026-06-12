export interface Teacher {
  id: string;
  name: string;
  subject: string;
  credential: string;
  initial: string;
}

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Aziza Karimova",
    subject: "Ingliz tili",
    credential: "IELTS 8.0 | 6 yillik tajriba",
    initial: "AK",
  },
  {
    id: "2",
    name: "Jahongir Ruzmetov",
    subject: "Matematika va Fizika",
    credential: "PhD | 8 yillik tajriba",
    initial: "JR",
  },
  {
    id: "3",
    name: "Gulnora Xodjayeva",
    subject: "Rus tili va Adabiyot",
    credential: "Filologiya fanlari nomzodi | 10 yillik tajriba",
    initial: "GX",
  },
  {
    id: "4",
    name: "Bekzod Toshmatov",
    subject: "IELTS va CEFR",
    credential: "IELTS 8.5 | 5 yillik tajriba",
    initial: "BT",
  },
];
