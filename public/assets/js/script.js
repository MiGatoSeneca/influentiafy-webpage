const conversion = [0.5, 0.75, 1.0, 1.5, 2, 4]
$('#form-hero').on('submit', function (e) {
    e.preventDefault();
    let form = e.target;
    let data = getFormHeroData(form);
    console.log(data);
    $('.form-step').addClass('d-none');
    $('.form-step[form-step=loading]').removeClass('d-none');
    $.ajax({
        url: `https://influentiafy-api.influmer.com/v1/youtube/${data.youtube_username}`,
        method: 'GET',
        success: function (response) {
            const averageViews = response.averageViews;
            console.log(averageViews);
            console.log(data.ltv);
            console.log(conversion[data.affinity]);
            const minBudget = averageViews * data.ltv * conversion[data.affinity];
            const maxBudget = averageViews * data.ltv * conversion[data.affinity + 1];

            let formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            let minBudgetFormatted = formatter.format(minBudget);
            let maxBudgetFormatted = formatter.format(maxBudget);

            // Mostrar resultados
            $('#budget').text(`${minBudgetFormatted} to ${maxBudgetFormatted}`);


            $('.form-step').addClass('d-none');
            $('.form-step[form-step=success]').removeClass('d-none');
        },
        error: function (error) {
            $('.form-step').addClass('d-none');
            $('.form-step[form-step=error]').removeClass('d-none');
        }
    });
});

function getFormHeroData(target) {
    let fields = {
        youtube_username: $(target).find('[name=youtube-username]').val(),
        ltv: $(target).find('[name=ltv]').val(),
        affinity: parseInt($(target).find('[name=affinity]:checked').val())
    }
    return fields;
}

function restartFormHero() {
    $('.form-step').addClass('d-none');
    $('.form-step[form-step=data]').removeClass('d-none');
}
