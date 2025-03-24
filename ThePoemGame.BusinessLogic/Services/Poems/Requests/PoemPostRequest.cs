using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.Common.Enums;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Poems.Requests
{
    public class PoemPostRequest
    {
        public required Guid GameId { get; set; }
        public required string Title { get; set; }
        public required string FirstLineContent { get; set; }
        public PaperType PaperType { get; set; }
    }
}
