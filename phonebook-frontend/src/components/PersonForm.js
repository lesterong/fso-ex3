const PersonForm = ({ newDetails, handleSubmit, handleInputChange}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input id="name" value={newDetails.name} onChange={handleInputChange} />
      </div>
      <div>
        number: <input id="number" value={newDetails.number} onChange={handleInputChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
