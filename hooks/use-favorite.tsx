import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // コンポーネントマウント時にローカルストレージから読み込み
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCourses");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // お気に入りの追加/削除
  const toggleFavorite = (courseId: string) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(courseId)) {
        // すでにお気に入りなら削除
        newFavorites = prevFavorites.filter((id) => id !== courseId);
      } else {
        // お気に入りに追加
        newFavorites = [...prevFavorites, courseId];
      }

      // ローカルストレージに保存
      localStorage.setItem("favoriteCourses", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // お気に入りかどうかをチェック
  const isFavorite = (courseId: string) => {
    return favorites.includes(courseId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
