import { useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import FadeLoader from "./FadeLoader";

const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

interface BibleFormProps {
  setThemes: React.Dispatch<React.SetStateAction<string>>;
  loadingBibleText: boolean;
  setLoadingBibleText: React.Dispatch<React.SetStateAction<boolean>>;
  loadingBibleThemes: boolean;
  setLoadingBibleThemes: React.Dispatch<React.SetStateAction<boolean>>;
  errorBibleText: string;
  setErrorBibleText: React.Dispatch<React.SetStateAction<string>>;
  errorBibleThemes: string;
  setErrorBibleThemes: React.Dispatch<React.SetStateAction<string>>;
}

export default function BibleForm({
  setThemes,
  loadingBibleText,
  setLoadingBibleText,
  loadingBibleThemes,
  setLoadingBibleThemes,
  errorBibleText,
  setErrorBibleText,
  errorBibleThemes,
  setErrorBibleThemes,
}: BibleFormProps) {
  const [bibleBook, setBibleBook] = useState<string>("");
  const [bibleText, setBibleText] = useState<string>("");
  const [bibleReference, setBibleReference] = useState("");

  const authFetch = useAuthFetch();

  async function getBibleText() {
    if (!bibleBook || !bibleReference.trim()) return;
    if (loadingBibleText || loadingBibleThemes) return;

    setLoadingBibleText(true);
    setErrorBibleText("");

    const passage = `${bibleBook} ${bibleReference}`;
    const params = { ref: passage };
    const query = new URLSearchParams(params).toString();

    try {
      const res = await authFetch(`/bible?${query}`);
      const data = await res.json();
      setBibleText(data.text || "");
    } catch (error) {
      setBibleText("");
      setErrorBibleText("Unable to fetch Bible passage");
      console.error("Bible fetch error:", error);
    } finally {
      setLoadingBibleText(false);
    }
  }

  async function getBibleThemes() {
    if (!bibleText.trim()) return;
    if (loadingBibleText || loadingBibleThemes) return;

    setLoadingBibleThemes(true);
    setErrorBibleThemes("");

    try {
      const res = await authFetch("/bible/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: bibleText }),
      });
      const data = await res.json();
      setThemes(data.themes || "");
    } catch (error) {
      console.error("Error generating themes:", error);
      setThemes("");
      setErrorBibleThemes("Error generating themes");
    } finally {
      setLoadingBibleThemes(false);
    }
  }

  function copyBibleTextToThemes() {
    if (!bibleText.trim()) return;
    setThemes(bibleText);
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 mt-3">
      {/* Bible reference section */}
      <div className="flex flex-col flex-0 gap-4 border-2 border-gray-300 border-dotted rounded-lg bg-gray-200 px-5 py-3">
        {/* Bible Book */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="bibleBook"
            className="text-purple-950 font-semibold text-sm"
          >
            Book
          </label>
          <input
            id="bibleBook"
            list="bible-books"
            value={bibleBook}
            placeholder="e.g. John"
            onChange={(e) => setBibleBook(e.target.value)}
            className="bg-white border border-purple-950 px-2 py-1"
          />

          <datalist id="bible-books">
            {bibleBooks.map((book) => (
              <option key={book} value={book} />
            ))}
          </datalist>
        </div>

        {/* Chapter and verses */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="chapterAndVerses"
            className="text-purple-950 font-semibold text-sm"
          >
            Chapter & Verses
          </label>
          <input
            type="text"
            name="chapterAndVerses"
            id="chapterAndVerses"
            value={bibleReference}
            placeholder="e.g. 1:1-4"
            onChange={(e) => setBibleReference(e.target.value)}
            className="bg-white py-1 px-2 border border-purple-950"
          />
        </div>

        {errorBibleText && (
          <p className="text-red-600 font-medium text-sm">{errorBibleText}</p>
        )}

        <button
          type="button"
          id="getBibleText"
          onClick={getBibleText}
          disabled={
            !bibleReference ||
            !bibleBook ||
            loadingBibleText ||
            loadingBibleThemes
          }
          className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer mt-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Get Text
        </button>

        {/* Copyright info */}
        <p className="text-sm text-gray-400">
          Scripture quotations are from the ESV® Bible (The Holy Bible, English
          Standard Version®), © 2001 by Crossway, a publishing ministry of Good
          News Publishers. Used by permission. All rights reserved.
        </p>
      </div>

      {/* Bible passage text */}
      <FadeLoader
        loading={loadingBibleText}
        minHeight="150px"
        className="w-full"
      >
        <div className="flex flex-col flex-1 gap-3 border-2 border-gray-300 border-dotted rounded-lg bg-gray-200 px-5 py-3">
          <div className="flex justify-between items-center">
            <label
              htmlFor="themes"
              className="text-purple-950 font-semibold text-sm"
            >
              Bible Text
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                id="get-bible-themes"
                onClick={copyBibleTextToThemes}
                disabled={
                  !bibleText.trim() || loadingBibleText || loadingBibleThemes
                }
                className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Use Raw Text
              </button>

              <button
                type="button"
                id="get-bible-themes"
                onClick={getBibleThemes}
                disabled={
                  !bibleText.trim() || loadingBibleText || loadingBibleThemes
                }
                className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Themes
              </button>
            </div>
          </div>

          {errorBibleThemes && (
            <p className="text-red-600 font-medium text-sm">
              {errorBibleThemes}
            </p>
          )}

          <textarea
            name="themes"
            id="themes"
            className="py-1 px-2 border border-purple-950 bg-white block min-w-[150px] min-h-[100px]"
            value={bibleText}
            placeholder="Copy text here or get from reference..."
            onChange={(e) => setBibleText(e.target.value)}
            rows={12}
          />
        </div>
      </FadeLoader>
    </div>
  );
}
