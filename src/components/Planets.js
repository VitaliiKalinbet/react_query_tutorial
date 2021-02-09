import React, { useState } from "react";
import { useQuery, usePaginatedQuery } from "react-query";
import Planet from "./Planet";

// const fetchPlanets = async (key, greeting, page) => {
//     console.log('key :>> ', key);
//     console.log('greeting :>> ', greeting);
//     console.log('page :>> ', page);
//     const res = await fetch(`http://swapi.dev/api/planets/?page=${key.queryKey[2]}`);
//     return res.json();
// };

const fetchPlanets = async (key, page) => {
  console.log("key :>> ", key);
  console.log("page :>> ", page);
  const res = await fetch(
    `http://swapi.dev/api/planets/?page=${key.queryKey[1]}`
  );
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  // const {data, status} = useQuery(['planets', page], fetchPlanets);
  const { data, status } = useQuery(["planets", page], fetchPlanets, {
    keepPreviousData: true,
  });

  return (
    <div>
      <h2>Planets</h2>
      {/* <p>{status}</p> */}

      {/* <button onClick={() => setPage(1)}>page 1</button>
      <button onClick={() => setPage(2)}>page 2</button>
      <button onClick={() => setPage(3)}>page 3</button> */}

      {status === "error" ? <div>Error fetching data</div> : null}

      {status === "loading" ? <div>Loading data...</div> : null}

      {status === "success" && (
        <section>
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <span>{page}</span>
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={!data || !data.next}
          >
            Next page
          </button>
          <div>
            {data.results.map((planet) => (
              <Planet key={planet.name} planet={planet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Planets;
