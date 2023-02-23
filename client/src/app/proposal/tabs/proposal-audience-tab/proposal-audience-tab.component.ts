import { Component, Input, OnInit } from '@angular/core';
import { InstaService } from 'src/app/@core';
import { CountryPipe } from 'src/app/shared/pipe/country.pipe';

@Component({
  selector: 'app-proposal-audience-tab',
  templateUrl: './proposal-audience-tab.component.html',
  styleUrls: ['./proposal-audience-tab.component.css'],
})
export class ProposalAudienceTabComponent implements OnInit {
  @Input() longLiveToken: any = null;
  @Input() pageID: any = null;

  isLoader: boolean = false;
  result = null;

  // Cities Data
  countries: string[] = null;
  countriesData: number[] = null;

  // City Data
  cities: string[] = null;
  citiesData: number[] = null;

  // Male Female Data
  totalPersons: number = 0;
  totalMale: number = null;
  totalFemale: number = null;
  totalUnknown: number = null;
  genderLabels: string[] = ['Male(%)', 'Female(%)', 'Un Specified(%)'];

  // Age Groups Data
  ageGroupLabels: string[] = [
    '13-17(%)',
    '18-24(%)',
    '25-34(%)',
    '35-44(%)',
    '45-54(%)',
    '55-64(%)',
    '65+(%)',
  ];
  ageGroupCount: number[] = [0, 0, 0, 0, 0, 0, 0];
  isAgeGroupCalculated: boolean = false;

  constructor(
    private countryPipe: CountryPipe,
    private instaService: InstaService
  ) {}

  ngOnInit() {
    console.log('proposal-audience', this.pageID, this.longLiveToken);
    if (this.pageID != null && this.longLiveToken != null) {
      this.getAudienceData();
    }
  }

  getAudienceData() {
    this.isLoader = true;
    this.instaService
      .getInsightsAudience(this.pageID, this.longLiveToken)
      .subscribe((res) => {
        console.log(res);
        this.result = res.data;
        this.findAudienceCountry();
        this.findAudienceCity();
        this.findGenderAudience();
        this.isLoader = false;
      });
  }

  findAudienceCountry() {
    if (this.result) {
      let audienceCountry = this.result.find(
        (a) => a.name === 'audience_country'
      );
      let d = audienceCountry?.values[0]?.value;

      var data = [];

      // converts JSON object to array
      for (var i in d) {
        data.push({ country: i, value: d[i] });
      }

      // Sorts Data on basis of followers from each country
      data.sort(function (a, b) {
        return b.value - a.value;
      });
      // console.log(data);

      // Countries and their respective data in from of arrays
      this.countries = data.slice(0, 10).map((a) => a.country);
      this.countriesData = data.slice(0, 10).map((a) => a.value);

      for (var j = 0; j < this.countries.length; j++) {
        this.countries[j] = this.countryPipe.transform(this.countries[j]);
      }

      // console.log(this.countries, this.countriesData);
    }
  }

  findAudienceCity() {
    if (this.result) {
      let audienceCity = this.result.find((a) => a.name === 'audience_city');
      let d = audienceCity.values[0].value;

      var data = [];

      // converts JSON object to array
      for (var i in d) {
        data.push({ city: i, value: d[i] });
      }

      // Sorts Data on basis of followers from each city
      data.sort(function (a, b) {
        return b.value - a.value;
      });
      // console.log(data);

      // Cities and their respective data in from of arrays
      this.cities = data.slice(0, 10).map((a) => a.city);
      this.citiesData = data.slice(0, 10).map((a) => a.value);

      // console.log(this.countries, this.countriesData);
    }
  }

  isMale(v: string): boolean {
    if (
      v === 'M.13-17' ||
      v === 'M.18-24' ||
      v === 'M.25-34' ||
      v === 'M.35-44' ||
      v === 'M.45-54' ||
      v === 'M.55-64' ||
      v === 'M.65+'
    ) {
      return true;
    }
    return false;
  }

  isFemale(v: string): boolean {
    if (
      v === 'F.13-17' ||
      v === 'F.18-24' ||
      v === 'F.25-34' ||
      v === 'F.35-44' ||
      v === 'F.45-54' ||
      v === 'F.55-64' ||
      v === 'F.65+'
    ) {
      return true;
    }
    return false;
  }

  // Finds and increments age group data
  countAgeGroup(v: string, value: number) {
    if (v.includes('13-17')) {
      this.ageGroupCount[0] += value;
    } else if (v.includes('18-24')) {
      this.ageGroupCount[1] += value;
    } else if (v.includes('25-34')) {
      this.ageGroupCount[2] += value;
    } else if (v.includes('35-44')) {
      this.ageGroupCount[3] += value;
    } else if (v.includes('45-54')) {
      this.ageGroupCount[4] += value;
    } else if (v.includes('55-64')) {
      this.ageGroupCount[5] += value;
    } else if (v.includes('65+')) {
      this.ageGroupCount[6] += value;
    } else return;
  }

  findGenderAudience() {
    if (!this.result) return;
    let audienceGender = this.result.find(
      (a) => a.name === 'audience_gender_age'
    );
    let d = audienceGender.values[0].value;

    var data = [];

    let maleCount = 0,
      femaleCount = 0,
      unKnownCount = 0;

    // converts JSON object to array
    for (var i in d) {
      data.push({ gender: i, value: d[i] });
      if (this.isMale(i)) {
        maleCount += d[i];
      } //counts Male
      else if (this.isFemale(i)) {
        femaleCount += d[i];
      } //counts female
      else {
        unKnownCount += d[i];
      } //counts unknown
      this.countAgeGroup(i, d[i]);
    }

    this.totalPersons = maleCount + femaleCount + unKnownCount;

    // Calculates % age for genders
    this.totalMale = +((maleCount / this.totalPersons) * 100).toFixed(2);
    this.totalFemale = +((femaleCount / this.totalPersons) * 100).toFixed(2);
    this.totalUnknown = +((unKnownCount / this.totalPersons) * 100).toFixed(2);

    // calculates %age for agr groups
    for (let j = 0; j < this.ageGroupCount.length; j++) {
      this.ageGroupCount[j] = +(
        (this.ageGroupCount[j] / this.totalPersons) *
        100
      ).toFixed(2);
    }

    this.isAgeGroupCalculated = true;
  }
}
