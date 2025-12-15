type SongExtraInfoProps = {
  song_key: string;
  is_hymn: boolean;
};

function SongExtraInfo({ song_key, is_hymn }: SongExtraInfoProps) {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-purple-900 font-bold text-lg mb-3">Info</h2>
        <div className="flex flex-wrap gap-x-10 gap-y-2">
          <div className="flex">
            <p>Key: <span className="font-bold">{song_key}</span></p>
          </div>
          <div className="flex gap-x-2">
            <p>Category: </p>
            <span className="font-bold">{is_hymn ? "Hymn" : "Song"}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SongExtraInfo;
