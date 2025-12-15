import { SiApplemusic } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import { SiMusescore } from "react-icons/si";

function SongResources() {
  return (
    <div className="flex flex-col">
      <h2 className="text-purple-900 font-bold text-lg mb-3">Resources</h2>
      <ul className="flex flex-wrap gap-x-10 gap-y-2">
        <div className="flex gap-y-2 gap-x-10">
          <li className="flex items-center gap-2 whitespace-nowrap">
            <SiApplemusic />
            Sheet Music
          </li>
          <li className="flex items-center gap-2 whitespace-nowrap">
            <IoLogoYoutube />
            Harmony Video
          </li>
        </div>
        <div className="flex gap-y-2 gap-x-10">
          <li className="flex items-center gap-2 whitespace-nowrap">
            <GrDocumentPdf />
            Harmony PDF
          </li>
          <li className="flex items-center gap-2 whitespace-nowrap">
            <SiMusescore />
            Harmony Musescore
          </li>
        </div>
      </ul>
    </div>
  );
}

export default SongResources;
