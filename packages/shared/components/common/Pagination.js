import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5,
  showPreviousNext = true,
  className = ""
}) => {


  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation example" className={className}>
        
      <ul className="pagination pull-right">
        {showPreviousNext && (
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a 
              className="page-link" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </a>
          </li>
        )}
        
        {pages.map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <a 
              className="page-link" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              style={{ cursor: 'pointer' }}
            >
              {page}
            </a>
          </li>
        ))}
        
        {showPreviousNext && (
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a 
              className="page-link" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
