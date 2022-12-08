function Pagination({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
}) {
  return (
    <div className="w-full flex justify-center">
      <div className="btn-group">
        <button
          className="btn"
          onClick={() => {
            gotoPage(0);
          }}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="btn"
          onClick={() => {
            previousPage();
          }}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        <button className="btn btn-active">
          {" "}
          {pageIndex + 1} of {pageOptions.length}
        </button>
        <button
          className="btn"
          onClick={() => {
            nextPage();
          }}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="btn"
          disabled={!canNextPage}
          onClick={() => {
            gotoPage(pageCount - 1);
          }}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default Pagination;
