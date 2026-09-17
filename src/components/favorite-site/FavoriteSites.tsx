import { useSettings } from "@/lib/useSettings";
import { AddFavoriteButton, FavoriteSite } from "./FavoriteSite";

export function FavoriteSites() {
  const { settings } = useSettings();

  return (
    <nav aria-label="Favorite sites" className="flex flex-row gap-x-6 gap-y-5">
      {settings.favoriteSites.map((props) => (
        <FavoriteSite key={props.url} {...props} />
      ))}
      <AddFavoriteButton />
    </nav>
  );
}
