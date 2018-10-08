export class Keyword{
  name?: string
  order = 0
}

export default class Category {
  name?: string
  color = "#00000"
  order = 0
  keywords: Array<Keyword> = []
}
