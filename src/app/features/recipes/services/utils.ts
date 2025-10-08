import { HttpContext } from '@angular/common/http';
import { CrudOperation } from '../../../core/types/crud';
import { Recipe } from '../recipe.model';
import { SKIP_AUTH } from '../../../core/interceptors/auth.interceptor';

export type CrudRecipesOperation = CrudOperation<Recipe>;

const RecipeBucketHttpContext = new HttpContext().set(SKIP_AUTH, true);

export { RecipeBucketHttpContext };
