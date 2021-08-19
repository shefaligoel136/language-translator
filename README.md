# TRANSLATION API WITH CACHING

Web server that exposes an API to translate a text

# SETUP

1. npm start (vs code) : localhost:8000
2. redis-server : port 6397

# Running the API

    POST: localhost:8000/translate
    FormData: text, language

# FEATURES

1. Translate the text according to the users preferred language
2. Pre-Caching is being done in a way such that when user enters a language then same text for other languages also gets cached anticipating that user might also want to translate in some other language.
3. Smart pre-cache function is being called in the translate text function in which related languages of the entered language are cheched, translated and stored in cache.

# External Services

1. vitalets/google-translate-api (for translation of the text)
2. iso-639-1 (for language code)

# Design Discussion

1. Express is used for routing.
2. Controller folder has translate_controller file which has the functionality of text translation and pre-caching.
3. Middleware folder contails the middleware of cache that act as a check before moving to the controller, on CACHE HIT it would return the value and not move to the controller on CACHE MISS will move to the controller.
4. User gives text and language as post parameters.
5. Translated text is cached to reduce response time of repeated api hits.
6. For similar languages a list of related languages is stored in a form of 2D array.
7. By comparing the response time of the api on cache hits and cache miss, evaluation can be done.

# Evalulation
    With the images added in the responseImages folder one can easily depect the smooth functioning of the API, When the language choosen was hindi there was a cache miss giving the response time to be 2.88 seconds, but because of smart caching Tamil being under the similar category of Hindi was added in cache and when tamil was choosen as the language, the response time came out to be 6ms only and since french is not under the similar category of hindi, it is not added in cache and hence sticking to the response time of 2.6 seconds