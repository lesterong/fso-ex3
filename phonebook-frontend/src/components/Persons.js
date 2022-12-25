const Persons = ({ persons, handleDelete }) => {
  return (
    <>
      {persons.map(p => (
        <div key={p.id}>
          {p.name} {p.number} {' '}
          <button type="button" onClick={handleDelete(p)}>delete</button>
        </div>
      ))}
    </>
  )
}

export default Persons
