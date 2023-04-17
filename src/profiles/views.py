from django.shortcuts import render
from .forms import ProfileForm
from .models import Profile
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.

def is_ajax(request):
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'

@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user = request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    response = is_ajax(request)
    if response:
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'avatar': instance.avatar.url,
                'user': instance.user.username,
            })
    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'profiles/main.html', context)        