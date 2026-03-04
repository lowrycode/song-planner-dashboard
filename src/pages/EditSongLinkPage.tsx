import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import FadeLoader from "../components/FadeLoader";
import DashboardPanel from "../components/DashboardPanel";
import SongLinkForm from "../components/SongLinkForm";

interface SongYouTubeLinkType {
  id: number;
  url: string;
  start_seconds: number | null;
  end_seconds: number | null;
  is_featured: boolean;
  title: string;
  description: string | null;
  thumbnail_key: string | null;
}

export default function EditSongLinkPage() {
  const navigate = useNavigate();
  const { linkId } = useParams<{ linkId: string }>();
  const linkIdNum = Number(linkId);

  const location = useLocation();
  const songIdNumFromState = location.state?.songId as number | undefined;

  const authFetch = useAuthFetch();

  const [link, setLink] = useState<SongYouTubeLinkType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Guard invalid link ID
  if (!linkIdNum || Number.isNaN(linkIdNum)) {
    return <p>Invalid link ID</p>;
  }

  // Fetch link data
  useEffect(() => {
    async function fetchLink() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authFetch(`/songs/youtube-links/${linkIdNum}`);

        if (response.status === 404) {
          navigate("/overview", { replace: true });
          return;
        }

        const data = await response.json();
        setLink(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLink();
  }, [linkIdNum]);

  async function handleUpdateLink(data: {
    start_seconds: number | null;
    end_seconds: number | null;
    is_featured: boolean;
    description: string | null;
  }) {
    setUpdateError(null);
    setSubmitting(true);

    try {
      const updatedLink = await authFetch(`/songs/youtube-links/${linkIdNum}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const updatedLinkData = await updatedLink.json();
      setLink(updatedLinkData);

      // Redirect back to song details page after update
      navigate(`/songs/${songIdNumFromState ?? linkIdNum}`);
    } catch (err: any) {
      console.error(err);
      setUpdateError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FadeLoader loading={isLoading} error={error}>
      <div className="flex flex-row flex-wrap justify-between gap-2 md:gap-4 my-4 mx-2 md:mx-3">
        {error && <p className="text-red-500">{error}</p>}

        {link && (
          <DashboardPanel className="flex-1 shrink-0">
            <SongLinkForm
              title="Edit Song Link"
              link={link}
              onSubmit={handleUpdateLink}
              onCancel={() =>
                navigate(`/songs/${songIdNumFromState ?? linkIdNum}`)
              }
              submitting={submitting}
              error={updateError}
            />
          </DashboardPanel>
        )}
      </div>
    </FadeLoader>
  );
}