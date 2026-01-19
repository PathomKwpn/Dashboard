import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchEvents } from "@/modules/Events/eventsSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state: any) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {list.map((e: any) => (
        <div key={e.id}>{e.message}</div>
      ))}
    </div>
  );
}
