import Link from 'next/link';
import { surahList } from '../../lib/surah/surah-list';

export function SurahList({ dataFiltered }: any) {
  const data = () => {
    if (dataFiltered) {
      return surahList.filter((item: any) => {
        // replace - with space or remove it
        return (
          Object.values(item)
            .join('')
            .toLowerCase()
            .includes(dataFiltered.toLowerCase()) ||
          Object.values(item)
            .join('')
            .toLowerCase()
            .replace(/-/g, '')
            .includes(dataFiltered.toLowerCase()) ||
          Object.values(item)
            .join('')
            .toLowerCase()
            .replace(/-/g, ' ')
            .includes(dataFiltered.toLowerCase()) ||
          Object.values(item)
            .join('')
            .toLowerCase()
            .replace(/'/g, '')
            .includes(dataFiltered.toLowerCase())
        );
      });
    } else {
      return surahList;
    }
  };
  return (
    <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 mt-10 mb-6">
      {data().map((surah) => (
        <li className="col-span-1 flex shadow-sm rounded-md" key={surah.id}>
          <div className="bg-quranmemo-primary flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md">
            {surah.arabicName}
          </div>
          <Link
            href={{
              pathname: `/quran/${surah.id}`,
              query: {
                id: surah.id,
              },
            }}
          >
            <a
              className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
              title={surah.name}
            >
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <span className="text-gray-900 font-semibold hover:text-gray-600">
                  {surah.name}
                </span>
                <p className="text-gray-500">{surah.ayat} ayat</p>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
