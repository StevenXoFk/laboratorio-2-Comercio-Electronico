import { Pagination as AlgoliaPagination } from 'react-instantsearch'
import '../../styles/Pagination.css'

function Pagination() {
  return (
    <div className="catalog-pagination">
      <AlgoliaPagination
        padding={2}
        showFirst={true}
        showPrevious={true}
        showNext={true}
        showLast={true}
        translations={{
          firstPageItemText: '«',
          previousPageItemText: '‹',
          nextPageItemText: '›',
          lastPageItemText: '»',
        }}
      />
    </div>
  )
}

export default Pagination