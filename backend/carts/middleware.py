from django.utils.deprecation import MiddlewareMixin


class SameSiteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
