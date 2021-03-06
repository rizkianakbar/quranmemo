import { fetcher } from '@/utils/fetcher';
import {
  BookmarkIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Option, OptionSwitch } from '..';
import { Tafsir } from '../tafsir';
import Modal from '../ui/modal/modal';

const calc = (input: number) => {
  let result = '';
  let num = input;
  for (let i = 0; i < 3; i++) {
    result = result + (num % 10);
    num = Math.floor(num / 10);
  }
  return result.split('').reverse().join('');
};

interface IModal {
  title: string;
  content: JSX.Element | string;
  button: string;
}

export function QuranDetails({ data }: any) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [bottomSheetTitle, setBottomSheetTitle] = React.useState('');
  const [bottomSheetContent, setBottomSheetContent] = React.useState('') as any;
  const [open, setOpen] = React.useState(false);
  const [option] = React.useState<Option>(Option.ReactSpringBottomSheet);
  const router = useRouter();
  const { text, translations } = data;
  const { id } = router.query;
  const [dataModal, setDataModal] = React.useState<IModal>({
    title: '',
    content: '',
    button: '',
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToogle = () => {
    setIsOpen(!isOpen);
  };
  const { data: session } = useSession();
  const isLogin = session !== null ? true : false;

  const onClickPlay = (index: number) => {
    if (isAudioPlaying) {
      return;
    } else {
      setIsAudioPlaying(true);
      const verse = document.getElementsByClassName('p-5')[index];
      if (verse) {
        verse.classList.add('border-4');
        verse.classList.add('bg-[#E0EFEE]');
      }
      const surah = calc(Number(id));
      const ayat = calc(index);
      const audioPath = `https://quranmemo.com/public/sound/Al_Afasy/${surah}${ayat}.mp3`;

      const audio = new Audio(audioPath);
      audio.play();
      audio.onended = () => {
        setIsAudioPlaying(false);
        if (verse) {
          verse.classList.remove('border-4');
          verse.classList.remove('bg-[#E0EFEE]');
        }
      };
    }
  };

  const onReady = () => setOpen(true);

  const onDismiss = () => setOpen(false);

  const onClickTafsir = (index: number) => {
    setBottomSheetTitle(`Tafsir ${data.name_latin} : ${index}`);
    setBottomSheetContent(<Tafsir data={data.tafsir.id.kemenag.text[index]} />);
    onReady();
  };

  const buttonData = [
    {
      text: 'Play',
      icon: PlayIcon,
      onclick: 'play',
    },
    {
      text: 'Share',
      icon: ShareIcon,
    },
    {
      text: 'Memorize',
      icon: PlusIcon,
      onclick: 'memorize',
    },
    {
      text: 'Tafsir',
      icon: BookmarkIcon,
      onclick: 'tafsir',
    },
  ];

  const surahList = Object.keys(text).map((ayat: string, i: number) => {
    return (
      <>
        <div className="p-5" id={`verse-${id}`} key={ayat}>
          <p className="quran text-2xl text-[#0d4643] text-right mb-4">
            {text[ayat]}
          </p>
          <p className="text-gray-500 text-sm">
            <span>( {i + 1} ) </span>
            {translations.id.text[i + 1]}
          </p>
        </div>
        <div className="bg-gray-100 text-center text-gray-400 text-sm divide-x divide-dashed divide-gray-300">
          {buttonData.map((item) => {
            return (
              <span key={item.text}>
                {item.onclick !== 'memorize' ? (
                  <button
                    className="px-2 hover:bg-[#5EEAD3] hover:text-white"
                    {...(item.onclick === 'play'
                      ? {
                          onClick: () => {
                            onClickPlay(i + 1);
                          },
                        }
                      : item.onclick === 'tafsir'
                      ? {
                          onClick: () => {
                            onClickTafsir(i + 1);
                          },
                        }
                      : {})}
                  >
                    {React.createElement(item.icon, {
                      className: 'h-5 inline-block mr-1',
                    })}
                    {item.text}
                  </button>
                ) : (
                  <>
                    {isLogin ? (
                      <Link
                        href={`/ziyadah/${id}?id=${id}&firstAyat=${
                          i + 1
                        }&secondAyat=${i + 1}`}
                        passHref
                      >
                        <button
                          onClick={async () => {
                            const body = {
                              email: session?.user?.email as string,
                              surahId: Number(id),
                              startAyatId: Number(i + 1),
                              endAyatId: Number(i + 1),
                              status: 0,
                            };
                            await fetcher('/api/set-hafalan', { user: body });
                          }}
                          className="px-2 hover:bg-[#5EEAD3] hover:text-white"
                        >
                          {React.createElement(item.icon, {
                            className: 'h-5 inline-block mr-1',
                          })}
                          {item.text}
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setDataModal({
                            title: 'Access to this page is restricted',
                            content: 'You need to login to access this page.',
                            button: 'Got it, thanks!',
                          });
                        }}
                        className="px-2 hover:bg-[#5EEAD3] hover:text-white"
                      >
                        {React.createElement(item.icon, {
                          className: 'h-5 inline-block mr-1',
                        })}
                        {item.text}
                      </button>
                    )}
                  </>
                )}
              </span>
            );
          })}
        </div>
      </>
    );
  });
  return (
    <div className="bg-white shadow overflow-hidden rounded-md">
      <div className="divide-y divide-dashed divide-gray-300">{surahList}</div>
      <Modal
        isOpen={isOpen}
        onToggle={handleToogle}
        title={dataModal.title}
        content={dataModal.content}
        button={dataModal.button}
      />
      <OptionSwitch
        option={option}
        open={open}
        onReady={onReady}
        onDismiss={onDismiss}
        title={bottomSheetTitle}
        content={bottomSheetContent}
      />
    </div>
  );
}
