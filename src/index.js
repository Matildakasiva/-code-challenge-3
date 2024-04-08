// Your code here

document.addEventListener("DOMContentLoaded", () => {
    function filmDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((res) => res.json())
        .then((movieData) => {
            const availableTickets = movieData.capacity - movieData.tickets_sold;

            const movieDetailsHTML = `
                <div>
                    <img src="${movieData.poster}" alt="${movieData.title}" style="max-width: 200px; max-height: 300px;">
                    <h2>${movieData.title}</h2>
                    <p><strong>Runtime:</strong> ${movieData.runtime} minutes</p>
                    <p><strong>Showtime:</strong> ${movieData.showtime}</p>
                    <p><strong>Available Tickets:</strong> ${availableTickets}</p>
                </div>
            `;

            const filmItem = document.querySelector('.film.item');
            filmItem.innerHTML = movieDetailsHTML
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
    }

    function filmsList() {
        const filmList = document.querySelector('#films');
        fetch('http://localhost:3000/films', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((res) => res.json())
        .then((data) => {
            data.forEach(film => {
                const titleElement = document.createElement('li');
                titleElement.textContent = film.title;
                titleElement.classList.add('film')

                titleElement.addEventListener('click', () => {
                    filmDetails(film.id)
                });

                filmList.appendChild(titleElement);
            });
        })
        .catch(error => {
            console.error('Error fetching film list:', error);
        });
    }
    filmsList();

    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.addEventListener('click', () => {
        const filmId = '1'
        fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id: filmId,
                number_of_tickets: 1
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to purchase ticket');
            }
            return response.json();
        })
        .then(purchaseData => {
            const updatedTicketsSold = purchaseData.tickets_sold + 1;
            return fetch(`http://localhost:3000/films/${filmId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: updatedTicketsSold
                })
            });
        })
        .then(updatedResponse => {
            if (!updatedResponse.ok) {
                throw new Error('Failed to update tickets');
            }
            return updatedResponse.json();
        })
        .then(updatedFilmData => {
            filmDetails(filmId)
        })
        .catch(error => {
            console.error('Error purchasing ticket:', error);
        });
    });

document.getElementById('films').addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            const filmId = event.target.dataset.filmId
            deleteFilm(filmId)
        }
    });
    function deleteFilm(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete film ${filmId}`);
            }
            console.log(`Film ${filmId} deleted successfully`)
        })
        .catch(error => {
            console.error('Error deleting film:', error);
        });
    } 
    deleteFilm()
    
});
