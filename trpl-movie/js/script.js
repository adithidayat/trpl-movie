// Variabel Global
let currentPage = 1;
let currentSearch = "Avengers"; // Film yang muncul otomatis saat web dibuka

//  Fungsi Utama untuk Memanggil API
function searchMovie(page = 1) {
    currentPage = page;

    // Tampilkan loading di daftar movie
    $('#movie-list').html('<div class="col text-center"><h5>Loading movies...</h5></div>');

    $.ajax({
        url: 'https://www.omdbapi.com/',
        type: 'get',
        dataType: 'json',
        data: {
            'apikey': 'ef23e699',
            's': currentSearch,
            'page': currentPage
        },
        success: function (result) {
            if (result.Response == "True") {
                let movies = result.Search;
                $('#movie-list').html(''); // Bersihkan loading

                // Tampilkan daftar film
                $.each(movies, function (i, data) {
                    $('#movie-list').append(`
                        <div class="col-md-4">
                            <div class="card mb-4 shadow-sm">
                                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" class="card-img-top">
                                <div class="card-body">
                                    <h5 class="card-title text-truncate">${data.Title}</h5>
                                    <h6 class="card-subtitle mb-3 text-muted">${data.Year}</h6>
                                    <button class="btn btn-primary btn-sm see-detail" data-toggle="modal" data-target="#exampleModal" data-id="${data.imdbID}">
                                        See Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                });

                // Pagination
                // Tombol Previous
                if (currentPage <= 1) {
                    $('#prev-page').parent().addClass('disabled');
                } else {
                    $('#prev-page').parent().removeClass('disabled');
                }

                // Tombol Next
                if (result.totalResults <= currentPage * 10) {
                    $('#next-page').parent().addClass('disabled');
                } else {
                    $('#next-page').parent().removeClass('disabled');
                }

            } else {
                // Jika film tidak ditemukan atau error
                $('#movie-list').html('<div class="col"><h1 class="text-center">' + result.Error + '</h1></div>');
                $('.pagination').hide(); // menyembunyikan pagination jika error
            }
        }
    });
}




$(document).ready(function() {
    searchMovie(1);
});

// Logika Pencarian
$('#button-search').on('click', function () {
    let inputVal = $('#search-input').val();
    if (inputVal !== "") {
        currentSearch = inputVal;
        $('.pagination').show();
        searchMovie(1);
    }
});

// Logika Pencarian  Enter
$('#search-input').on('keyup', function (e) {
    if (e.which === 13) {
        let inputVal = $('#search-input').val();
        if (inputVal !== "") {
            currentSearch = inputVal;
            $('.pagination').show();
            searchMovie(1);
        }
    }
});

// Tombol Navigasi Pagination
$('#next-page').on('click', function (e) {
    e.preventDefault();
    if (!$(this).parent().hasClass('disabled')) {
        searchMovie(currentPage + 1);
        window.scrollTo(0, 0);
    }
});

$('#prev-page').on('click', function (e) {
    e.preventDefault();
    if (currentPage > 1) {
        searchMovie(currentPage - 1);
        window.scrollTo(0, 0);
    }
});

// Fitur See Detail 
$('#movie-list').on('click', '.see-detail', function () {
    $('.modal-body').html('<div class="text-center">Loading...</div>');

    $.ajax({
        url: 'https://www.omdbapi.com/',
        dataType: 'json',
        type: 'get',
        data: {
            'apikey': 'ef23e699',
            'i': $(this).data('id')
        },
        success: function (movie) {
            if (movie.Response === "True") {
                $('.modal-body').html(`
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}" class="img-fluid rounded">
                            </div>
                            <div class="col-md-8">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><h3>${movie.Title}</h3></li>
                                    <li class="list-group-item"><b>Released:</b> ${movie.Released}</li>
                                    <li class="list-group-item"><b>Genre:</b> ${movie.Genre}</li>
                                    <li class="list-group-item"><b>Director:</b> ${movie.Director}</li>
                                    <li class="list-group-item"><b>Actors:</b> ${movie.Actors}</li>
                                    <li class="list-group-item"><b>Plot:</b> <br> ${movie.Plot}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `);
            }
        }
    });
});