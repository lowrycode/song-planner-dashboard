interface SongThemesProps {
    themes: string;
}

export default function SongThemes({themes}: SongThemesProps) {
  return (
      <div className="flex flex-col">
        <h2 className="text-purple-900 font-bold text-lg mb-3">Themes</h2>
        <p className="whitespace-pre-line">{themes}</p>
      </div>
    );
}
