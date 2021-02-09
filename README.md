# Репозиторий создан в ходе изучения пакета react-query

Рабочая ссылка на созданное приложение, но запрос не происходит так как останавливается CORSом (приложение будет работать с http://localhost:3000 если вы склонируете себе данный репозиторий, установите node modules и звпустите сборку):

```
https://vitaliikalinbet.github.io/react_query_tutorial/
```

Вот оригинальный репозиторий автора:

```
https://github.com/iamshaunjp/react-query-tutorial/
```

Вот видео:

```
https://www.youtube.com/watch?v=x1rQ61otgtU&list=PL4cUxeGkcC9jpi7Ptjl5b50p9gLjOFani&index=1&ab_channel=TheNetNinja
```

НО ЕСТЬ РЯД ОТЛИЧИЙ, о них ниже.

## Чтобы в приложении работал react-query, его подключение должно быть таким:

```js
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Planets from "./components/Planets";
import People from "./components/People";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState("planets");

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <h1>Star wars info</h1>
          <Navbar setPage={setPage} />
          <div className="content">
            {page === "planets" ? <Planets /> : <People />}
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
```

## Переданный массив параметров в useQuery не работает так как показано в видео, доступ возможен только обратившись вот так:

```js
const fetchPlanets = async (key, page) => {
  const res = await fetch(
    `http://swapi.dev/api/planets/?page=${key.queryKey[1]}`
  );
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  const { data, status } = useQuery(["planets", page], fetchPlanets);

  return <div>//...</div>;
};
```

## Показанный usePaginatedQuery уже как я понял не используется, вместо это используем обычный useQuery вот так:

```js
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

  const { data, status } = useQuery(["planets", page], fetchPlanets, {
    keepPreviousData: true,
  });

  return (
    <div>
      <h2>Planets</h2>

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
```
