using System;
using System.Collections.Generic;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Games.Responses
{
    public class GameResponse
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string Name { get; set; }
        public List<BasicUser> Players { get; set; }
        public GameStatus Status { get; set; }
        public GamePhase Phase { get; set; }
        public List<BasicPoem> Poems { get; set; }
        public int MaxPlayers { get; set; }
        public int LinesPerPoem { get; set; }
        public List<BasicUser> PlayerOrder { get; set; }
        public string InviteCode { get; set; }
        public bool HasCreatedPoem { get; set; }
        public List<BasicPoem> PoemsWaiting { get; set; }

        public GameResponse(Game game)
        {
            Id = game.Id;
            GroupId = game.GroupId;
            Name = game.Name;
            Players = game.Players;
            Status = game.Status;
            Phase = game.Phase;
            Poems = game.Poems;
            MaxPlayers = game.MaxPlayers;
            LinesPerPoem = game.LinesPerPoem;
            PlayerOrder = game.PlayerOrder;
            InviteCode = game.InviteCode;
            HasCreatedPoem = false;
            PoemsWaiting = new List<BasicPoem>();
        }

        public static GameResponse FromGame(Game game, User currentUser)
        {
            var response = new GameResponse(game);

            // Check if user has created a poem
            response.HasCreatedPoem = game.Poems.Any(p => p.Author.Id == currentUser.Id);

            // Get poems waiting for user's contribution
            response.PoemsWaiting = currentUser.PoemsWaiting
                .Where(p => game.Poems.Any(gp => gp.Id == p.Id))
                .ToList();

            return response;
        }
    }
}