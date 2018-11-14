import { Component } from '@angular/core';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { skipWhile, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { FacetCount } from 'state-management/state/datasets.store';
import {
  getLocationFacetCounts,
  getGroupFacetCounts,
  getTypeFacetCounts,
  getKeywordFacetCounts,
  getLocationFilter,
  getTypeFilter,
  getKeywordsFilter,
  getGroupFilter,
  getCreationTimeFilter,
  getSearchTerms,
  getHasAppliedFilters
} from "state-management/selectors/datasets.selectors";

import {
  AddLocationFilterAction,
  RemoveLocationFilterAction,
  AddGroupFilterAction,
  RemoveGroupFilterAction,
  AddKeywordFilterAction,
  RemoveKeywordFilterAction,
  AddTypeFilterAction,
  RemoveTypeFilterAction,
  ClearFacetsAction,
  SetDateRangeFilterAction,
  SetSearchTermsAction,
  SetTextFilterAction
} from 'state-management/actions/datasets.actions';
import { ScientificConditionDialogComponent } from 'datasets/scientific-condition-dialog/scientific-condition-dialog.component';

type DateRange = {
  begin: Date;
  end: Date;
};

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.css"]
})
export class DatasetsFilterComponent {
  locationFacetCounts$ = this.store.pipe(select(getLocationFacetCounts));
  groupFacetCounts$ = this.store.pipe(select(getGroupFacetCounts));
  typeFacetCounts$ = this.store.pipe(select(getTypeFacetCounts));
  keywordFacetCounts$ = this.store.pipe(select(getKeywordFacetCounts));

  searchTerms$ = this.store.pipe(select(getSearchTerms));
  locationFilter$ = this.store.pipe(select(getLocationFilter));
  groupFilter$ = this.store.pipe(select(getGroupFilter));
  typeFilter$ = this.store.pipe(select(getTypeFilter));
  private keywordsFilter$ = this.store.pipe(select(getKeywordsFilter));
  creationTimeFilter$ = this.store.pipe(select(getCreationTimeFilter));

  hasAppliedFilters$ = this.store.pipe(select(getHasAppliedFilters));

  private searchTermSubscription = this.searchTerms$
    .pipe(
      skipWhile(terms => terms === ""),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(terms => {
      this.store.dispatch(new SetTextFilterAction(terms));
    });

  constructor(
    public dialog: MatDialog,
    private store: Store<any>
  ) {}

  getFacetId(facetCount: FacetCount, fallback: string = null): string {
    const id = facetCount._id;
    return id ? String(id) : fallback;
  }

  getFacetCount(facetCount: FacetCount): number {
    return facetCount.count;
  }

  textSearchChanged(terms: string) {
    this.store.dispatch(new SetSearchTermsAction(terms));
  }

  locationSelected(location: string | null) {
    this.store.dispatch(new AddLocationFilterAction(location || ""));
  }

  locationRemoved(location: string) {
    this.store.dispatch(new RemoveLocationFilterAction(location));
  }

  groupSelected(group: string) {
    this.store.dispatch(new AddGroupFilterAction(group));
  }

  groupRemoved(group: string) {
    this.store.dispatch(new RemoveGroupFilterAction(group));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(new AddKeywordFilterAction(keyword));
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(new RemoveKeywordFilterAction(keyword));
  }

  typeSelected(type: string) {
    this.store.dispatch(new AddTypeFilterAction(type));
  }

  typeRemoved(type: string) {
    this.store.dispatch(new RemoveTypeFilterAction(type));
  }

  dateChanged(event: MatDatepickerInputEvent<DateRange>) {
    const { begin, end } = event.value;
    this.store.dispatch(
      new SetDateRangeFilterAction(begin.toISOString(), end.toISOString())
    );
  }

  clearFacets() {
    this.store.dispatch(new ClearFacetsAction());
  }

  showAddConditionDialog() {
    this.dialog
      .open(ScientificConditionDialogComponent)
      .afterClosed()
      .subscribe(({ data }) => {
        this.conditions.push(data);
      });
  }

  public conditions: {relation: string, lhs: any, rhs: any}[] = []; // TODO move

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  conditionQuery() {
    const and = this.conditions.map(cond => {
      const { relation, lhs, rhs } = cond;
      const dollar = {
        "EQUAL_TO_NUMERIC": "$eq",
        "EQUAL_TO_STRING": "$eq",
        "LESS_THAN": "$lt",
        "GREATER_THAN": "$gt"
      }[relation];
      return { [lhs]: { [dollar]: rhs }};
    });

    return { and };
  }
}
