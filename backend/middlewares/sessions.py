class AnonymousUserSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not (request.user.is_authenticated or request.session.session_key):
            request.session.create()

        return self.get_response(request)
