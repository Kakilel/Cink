
import { useParams } from "react-router-dom";
import Spotify from "./platforms/Spotify";


function PlatformDetail() {
  const { platform } = useParams();

  const platformComponents = {
    spotify: Spotify,
    // discord: Discord, etc.
  };

  const Component = platformComponents[platform];

  return Component ? <Component /> : <p>Platform not found.</p>;
}

export default PlatformDetail;
