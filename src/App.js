import React, { useState, useEffect, useRef } from 'react';
import './style.css';

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const eleRef = useRef(null);

  const fetchData = () => {
    setLoading(true);
    fetch(`https://api.spicesinfo.in/auction-all/${page}/50`)
      .then(async (res) => {
        const response = await res.json();
        setData((prevData) => [...prevData, ...response]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entities) => {
        if (entities[0].isIntersecting && !isLoading) {
          fetchData();
        }
      },
      {
        threshold: 1,
      }
    );
    if (eleRef?.current) observer.observe(eleRef.current);

    return () => {
      if (eleRef.current) {
        observer.unobserve(eleRef?.current);
      }
    };
  }, [isLoading]);

  return isLoading ? (
    <div>Loading....</div>
  ) : (
    <ul>
      {data?.map((e, index) => {
        return (
          <li id={e.id} key={e.id}>
            {e?.auctioneer}
          </li>
        );
      })}
      <li ref={eleRef}>loading..</li>
    </ul>
  );
}
