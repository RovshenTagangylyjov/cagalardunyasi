from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff


class AdminOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class UpdateAdminOnly(BasePermission):
    def has_permission(self, request, view):
        return view.action not in ['update', 'partial_update'] or request.user.is_staff


class UserPermission(BasePermission):
    def has_permission(self, request, view):
        return request.method == 'POST' or request.user.is_authenticated
