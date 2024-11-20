const events_api = "https://api.calendly.com/event_types";
const event_available_slots_api =
  "https://api.calendly.com/event_type_available_times";
const event_title = document.querySelector("#event-title");
const event_desc = document.querySelector("#event-desc");
const event_marker = document.querySelector("#event-marker");
const event = document.querySelector(".event");
const load = document.querySelector("#load");
const date = document.querySelector("#date");
const slots_blk = document.querySelector("#slots_blk");
const slot_data = document.querySelector("#slot_data");
const selected_date = document.querySelector("#selected_date");
const events_data = {
  active: true,
  organization:
    "https://api.calendly.com/organizations/9ee72142-22bf-4912-b045-c2f96a5df124",
};
const token =
  "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjg0MzI2MTYyLCJqdGkiOiIyYTY4ZjVjZC1jN2U1LTRlYzMtOTQ0YS1kYjQ4MmU1MTY5NzQiLCJ1c2VyX3V1aWQiOiI1YjA1NjNjOS00MjEyLTQ0N2MtYWY3MC1iOTQ3NjExNDVlNDAifQ.Az4Rmsf--sWohGvW8WkyEPTfzG1bXHyxafrXcUmfAO-Mw1CQYgwL2xjxSlMq3P0WLW53QBXdYWq7ezHsNH8hdw";
const events_url = `${events_api}?${new URLSearchParams(events_data)}`;

function fetchEvents() {
  fetch(events_url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.collection[0]);
      load.classList.add("d-none");
      event.classList.remove("d-none");
      let events_data = data?.collection[0];
      event_title.innerHTML = events_data.name;
      console.log(events_data.name);
      console.log(events_data.description_plain);
      console.log(events_data.uri);

      event_desc.innerHTML = events_data.description_plain;
      event.setAttribute("data-uri", events_data.uri);
      console.log(event);
    });
}

fetchEvents();

function showCalendar() {
  event.classList.add("d-none");
  date.classList.remove("d-none");
  $("#date").datepicker({
    minDate: 0,
    dateFormat: "yy-mm-dd",
    onSelect: function (date) {
      getAvailableTimes(date);
    },
  });
}

function getAvailableTimes(date) {
  selected_date.innerHTML = null;
  slot_data.innerHTML = null;
  let start_date = moment(date, "YYYY-MM-DD").format("YYYY-MM-DDTHH:mm:ss");
  let end_date = moment(date, "YYYY-MM-DD")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");
  console.log(end_date);
  load.classList.remove("d-none");
  event.classList.add("d-none");
  const event_avialable_times_data = {
    event_type: event.getAttribute("data-uri"),
    start_time: start_date,
    end_time: end_date,
  };
  const event_avialable_times_url = `${event_available_slots_api}?${new URLSearchParams(
    event_avialable_times_data
  )}`;

  fetch(event_avialable_times_url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let slots_data = data.collection;
      console.log(slots_data);
      load.classList.add("d-none");
      if (data.collection?.length) {
        let slots_list = slots_data
          .map((e) => {
            return `
            <div class="row justify-content-md-center">
              <div class="col col-6 time-slot text-center m-2"><a href="#" onclick="Calendly.initPopupWidget({url: '${
                e.scheduling_url
              }'});return false">${moment(e.start_time).format(
              "hh:mm A"
            )}</a></div>
            </div>
          `;
          })
          .join("");
        selected_date.innerHTML = `<b>${moment(date, "YYYY-MM-DD").format(
          "ddd, MMM DD"
        )}<b>`;
        slot_data.classList.remove("d-none");
        slot_data.innerHTML = slots_list;
      } else {
        selected_date.innerHTML = `No Slots found for selected date. Please choose another date`;
      }
    });
}

event.onclick = showCalendar;
