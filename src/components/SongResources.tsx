import { SiApplemusic } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import { SiMusescore } from "react-icons/si";
import SongResourceItem from "./SongResourceItem";


interface SongResourcesProps {
  resources: {
    sheet_music: string | null;
    harmony_vid: string | null;
    harmony_pdf: string | null;
    harmony_ms: string | null;
  };
}


function SongResources({ resources }: SongResourcesProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-purple-900 font-bold text-lg mb-3">Resources</h2>
      <ul className="flex flex-wrap gap-x-10 gap-y-2">
        <div className="flex gap-y-2 gap-x-10">
          <SongResourceItem
            href={resources.sheet_music}
            icon={<SiApplemusic />}
            label="Sheet Music"
          />
          <SongResourceItem
            href={resources.harmony_vid}
            icon={<IoLogoYoutube />}
            label="Harmony Video"
          />
        </div>
        <div className="flex gap-y-2 gap-x-10">
          <SongResourceItem
            href={resources.harmony_pdf}
            icon={<GrDocumentPdf />}
            label="Harmony PDF"
          />
          <SongResourceItem
            href={resources.harmony_ms}
            icon={<SiMusescore />}
            label="Harmony Musescore"
          />
        </div>
      </ul>
    </div>
  );
}

export default SongResources;
