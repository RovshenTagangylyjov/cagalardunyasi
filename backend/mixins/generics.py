from django.db.models import Q


class UsersStaffMixin:
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(user=self.request.user) | Q(session=self.request.session.session_key))

        return self.queryset.filter(session=self.request.session.session_key)

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id

        else:
            request.data['session'] = request.session.session_key

        return super().create(request, *args, **kwargs)
