from custom.permissions import IsAdminOrReadOnly


class IsAdminOrIsAuthenticatedAndLikeOrReadOnly(IsAdminOrReadOnly):
    def has_permission(self, request, view):
        return super().has_permission(request, view) or view.action == 'like' and request.user.is_authenticated
