import { useEffect, useState } from "react";
import RegisterForm from "../components/RegisterForm";

export interface Network {
  id: number;
  name: string;
}

export interface Church {
  id: number;
  name: string;
  slug: string;
}

export default function RegisterPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(
    null
  );
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurchId, setSelectedChurchId] = useState<number | null>(null);
  const [networksLoading, setNetworksLoading] = useState(true);
  const [churchesLoading, setChurchesLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [churchError, setChurchError] = useState<string | null>(null);

  // Fetch networks
  useEffect(() => {
    async function fetchNetworks() {
      setNetworksLoading(true);
      try {
        const response = await fetch("http://localhost:8000/networks");
        if (!response.ok) throw new Error("Failed to fetch networks");
        const data = await response.json();
        setNetworks(data);
        setNetworkError(null);
      } catch (err) {
        if (err instanceof Error) {
          setNetworkError(err.message);
        } else {
          setNetworkError("An error occurred");
        }
      } finally {
        setNetworksLoading(false);
      }
    }
    fetchNetworks();
  }, []);

  // Fetch churches
  useEffect(() => {
    if (!selectedNetworkId) {
      setChurches([]);
      setSelectedChurchId(null);
      return;
    }

    const controller = new AbortController();

    async function fetchChurches() {
      setChurchesLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/networks/${selectedNetworkId}/churches`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error();
        setChurches(await res.json());
        setChurchError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (err instanceof Error) {
          setChurchError(err.message);
        } else {
          setChurchError("An error occurred");
        }
      } finally {
        setChurchesLoading(false);
      }
    }

    fetchChurches();
    return () => controller.abort();
  }, [selectedNetworkId]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden md:block md:w-2/5">
        <img
          src="/images/worship.webp"
          alt="Corporate worship"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-3/5 bg-gray-50 relative overflow-x-hidden overflow-y-auto">
        <img
          src="/images/ccn_logo_desat.png"
          alt="Corporate worship"
          className="w-2/7 absolute -right-1/20 -top-5 opacity-20"
        />
        <div className="relative z-20 max-w-96 mx-auto px-6 mt-20">
          <RegisterForm
            networks={networks}
            churches={churches}
            selectedNetworkId={selectedNetworkId}
            setSelectedNetworkId={setSelectedNetworkId}
            selectedChurchId={selectedChurchId}
            setSelectedChurchId={setSelectedChurchId}
            networksLoading={networksLoading}
            churchesLoading={churchesLoading}
            networkError={networkError}
            churchError={churchError}
          />
        </div>
        <img
          src="/images/hymn_book_fade.png"
          alt="Corporate worship"
          className="max-h-1/4 w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
