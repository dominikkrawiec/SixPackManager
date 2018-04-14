$("button[type='submit']").click(function(e) {
        e.preventDefault();

        var step = $("form").data('step');
        isValid = true;

        $("section[data-step='" + step + "'] input[required='required']").each(function(idx, elem) {
            if($(elem).val().trim() === "") {
                isValid = false;

            }
          });

            if(isValid){
              step += 1;

              if(step > $("section[data-step]").length) {
                $("form").submit();
            }

            console.log(step);

            $("form").data('step', step);
            $("section[data-step]").addClass('hidden');
           $("section[data-step='" + step + "']").removeClass('hidden');


            }
  });
