DO $$
BEGIN
    -- Película 1
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 1) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (1, 'Movie 1', 'Description of Movie 1', 'Genre 1', 'Director 1', 'Actor 1, Actor 2', '2024-01-01', 120, 'PG-13', 4.2);
    END IF;

    -- Película 2
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 2) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (2, 'Movie 2', 'Description of Movie 2', 'Genre 2', 'Director 2', 'Actor 3, Actor 4', '2023-12-15', 115, 'PG', 3.9);
    END IF;

    -- Película 3
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 3) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (3, 'Movie 3', 'Description of Movie 3', 'Genre 3', 'Director 3', 'Actor 5, Actor 6', '2024-02-10', 130, 'R', 4.7);
    END IF;

    -- Película 4
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 4) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (4, 'Movie 4', 'Description of Movie 4', 'Genre 4', 'Director 4', 'Actor 7, Actor 8', '2023-11-20', 140, 'PG-13', 4.1);
    END IF;

    -- Película 5
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 5) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (5, 'Movie 5', 'Description of Movie 5', 'Genre 5', 'Director 5', 'Actor 9, Actor 10', '2024-03-05', 125, 'PG', 3.8);
    END IF;

    -- Película 6
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 6) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (6, 'Movie 6', 'Description of Movie 6', 'Genre 1', 'Director 6', 'Actor 11, Actor 12', '2023-10-30', 110, 'R', 4.5);
    END IF;

    -- Película 7
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 7) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (7, 'Movie 7', 'Description of Movie 7', 'Genre 2', 'Director 7', 'Actor 13, Actor 14', '2024-04-18', 95, 'PG', 3.6);
    END IF;

    -- Película 8
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 8) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (8, 'Movie 8', 'Description of Movie 8', 'Genre 3', 'Director 8', 'Actor 15, Actor 16', '2023-09-12', 100, 'PG-13', 4.4);
    END IF;

    -- Película 9
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 9) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (9, 'Movie 9', 'Description of Movie 9', 'Genre 4', 'Director 9', 'Actor 17, Actor 18', '2024-05-25', 105, 'R', 4.8);
    END IF;

    -- Película 10
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 10) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (10, 'Movie 10', 'Description of Movie 10', 'Genre 5', 'Director 10', 'Actor 19, Actor 20', '2023-08-08', 150, 'PG-13', 3.7);
    END IF;

    -- Película 11
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 11) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (11, 'Movie 11', 'Description of Movie 11', 'Genre 1', 'Director 11', 'Actor 21, Actor 22', '2024-06-10', 135, 'PG', 4.0);
    END IF;

    -- Película 12
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 12) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (12, 'Movie 12', 'Description of Movie 12', 'Genre 2', 'Director 12', 'Actor 23, Actor 24', '2023-07-04', 145, 'R', 4.3);
    END IF;

    -- Película 13
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 13) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (13, 'Movie 13', 'Description of Movie 13', 'Genre 3', 'Director 13', 'Actor 25, Actor 26', '2024-07-22', 160, 'PG-13', 4.9);
    END IF;

    -- Película 14
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 14) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (14, 'Movie 14', 'Description of Movie 14', 'Genre 4', 'Director 14', 'Actor 27, Actor 28', '2023-06-15', 155, 'PG', 3.5);
    END IF;

    -- Película 15
    IF NOT EXISTS (SELECT 1 FROM public.movie_entity WHERE id = 15) THEN
        INSERT INTO public.movie_entity (id, title, description, genres, directors, actors, "premiereDate", duration, classification, score)
        VALUES (15, 'Movie 15', 'Description of Movie 15', 'Genre 5', 'Director 15', 'Actor 29, Actor 30', '2024-08-01', 90, 'R', 4.1);
    END IF;
END $$;
