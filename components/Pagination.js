function Pagination({ router, totalPages, url }) {
  return (
    <div className="w-full flex justify-center">
      <div className="btn-group">
        <button
          className="btn"
          onClick={() => {
            props.router.push(`${url}?page=1`);
          }}
          disabled={router.query?.page == 1 ?? true}
        >
          {"<<"}
        </button>
        <button
          className="btn"
          onClick={() => {
            router.push(`${url}?page=${parseInt(router.query?.page) - 1}`);
          }}
          disabled={router.query?.page < 2 ?? true}
        >
          {"<"}
        </button>
        <button className="btn btn-active">{router.query?.page || 1}</button>
        <button
          className="btn"
          onClick={() => {
            router.push(
              `${url}?page=${(parseInt(router.query.page) || 1) + 1}`
            );
          }}
          disabled={router.query?.page == totalPages}
        >
          {">"}
        </button>
        <button
          className="btn"
          disabled={router.query?.page == totalPages}
          onClick={() => {
            props.router.push(`${url}?page=${props.totalPages}`, undefined);
          }}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default Pagination;
