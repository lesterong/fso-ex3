const Filter = ({ query, handleQuery }) => {
  return (
    <div>
      filter shown with <input value={query} onChange={handleQuery} />
    </div>
  )
}

export default Filter
