type LyricsProps = {
  content: string;
};

function Lyrics({ content = "No lyrics provided" }: LyricsProps) {
  return (
    <div className="whitespace-pre-line">
      <h2 className="text-purple-900 font-bold text-lg mb-3">Lyrics</h2>
      {content}
    </div>
  );
}

export default Lyrics;
